using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using ClinicBooking.Data;
using ClinicBooking.Entities;
using ClinicBooking.Models;
using ClinicBooking.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ClinicBooking.Services
{
    public interface IAuthService
    {
        // TODO: change ID to int
        Task<AdminUser> GetAdminUserAsync(Guid ID, bool tracked = true);
        Task<List<AdminUser>> GetAdminUsersAsync();
        Task<bool> AddAdminUser(AdminUser user);
        Task<bool> UpdateAdminUser(Guid ID, AdminUser user);
        Task UpdateLastLoggedIn(AdminUser user);
        Task<bool> UpdateAdminUser(Guid ID, AdminUserEditModel Updateduser);
        public Task<bool> UpdateAdminUserPassword(Guid ID, string Password);
        Task<bool> DeleteAdminUser(Guid Id, Guid AdminId, string AdminEmail);

        Task<bool> VerifyAsync(string username, string password);
        Task LogoutAsync();
        Task<AdminUser> GetAdminUserByEmailAsync(string email);
        Task<AuthToken> CreateAuthTokenAsync(AdminUser user);
        Task<AdminUser> GetAdminUserFromTokenAsync(string token);
        Task<bool> ValidateRefreshTokenAsync(string token, string refreshtoken);
        Task RemoveRefreshTokenAsync(AdminUser user, string token);
        Task<AdminUser> UserFromJwtAsync(ClaimsPrincipal user = null);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AdminUser> _userManager;
        private readonly SignInManager<AdminUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthService(
            ApplicationDbContext context,
            UserManager<AdminUser> userManager,
            SignInManager<AdminUser> signInManager,
            IConfiguration configuration
        )
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<bool> VerifyAsync(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null || !user.IsActive || user.IsDeleted)
            {
                return false;
            }
            var passwordSignInResult = await _signInManager.PasswordSignInAsync(
                user,
                password,
                isPersistent: false,
                lockoutOnFailure: false
            );
            if (!passwordSignInResult.Succeeded)
            {
                return false;
            }
            return true;
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<AdminUser> GetAdminUserAsync(Guid ID, bool tracked = true)
        {
            if (tracked)
                return await _context.AdminUsers.SingleOrDefaultAsync(x => x.ID == ID);
            else
                return await _context
                    .AdminUsers.AsNoTracking()
                    .SingleOrDefaultAsync(x => x.ID == ID);
        }

        public async Task<List<AdminUser>> GetAdminUsersAsync()
        {
            var users = await _context.AdminUsers.Where(x => x.IsDeleted == false).ToListAsync();
            return users;
        }

        public async Task<bool> AddAdminUser(AdminUser user)
        {
            var create = await _userManager.CreateAsync(user);
            var pass = await _userManager.AddPasswordAsync(user, user.Password);
            //await _context.Users.AddAsync(user);
            //var count = await _context.SaveChangesAsync();
            return create.Succeeded && pass.Succeeded;
        }

        //UserResponse Updateduser
        public async Task<bool> UpdateAdminUser(Guid Id, AdminUserEditModel Updateduser)
        {
            var u = await GetAdminUserAsync(Id);
            if (u == null)
                return false;

            u.Email = Updateduser.Email;
            //u.IsActive = Updateduser.IsActive;
            var count = await _context.SaveChangesAsync();
            return count > 0;
        }

        public async Task<bool> UpdateAdminUser(Guid Id, AdminUser user)
        {
            var u = await GetAdminUserAsync(Id);
            if (u == null)
                return false;
            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                try
                {
                    if (await _userManager.HasPasswordAsync(u))
                    {
                        await _userManager.RemovePasswordAsync(u);
                    }
                    var addpass = await _userManager.AddPasswordAsync(u, user.Password);
                    if (!addpass.Succeeded)
                    {
                        throw new Exception();
                    }
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return false;
                }
            }
            u.FirstName = user.FirstName;
            u.LastName = user.LastName;
            u.IsActive = user.IsActive;
            var count = await _context.SaveChangesAsync();
            return count > 0;
        }

        public async Task<bool> UpdateAdminUserPassword(Guid Id, string Password)
        {
            var u = await GetAdminUserAsync(Id);
            if (u == null)
                return false;

            try
            {
                if (await _userManager.HasPasswordAsync(u))
                {
                    await _userManager.RemovePasswordAsync(u);
                }
                var addpass = await _userManager.AddPasswordAsync(u, Password);
                if (!addpass.Succeeded)
                {
                    throw new Exception();
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteAdminUser(Guid ID, Guid AdminID, string AdminEmail)
        {
            var user = await GetAdminUserAsync(ID);
            if (user == null)
                return false;
            user.Email = "DELETED_" + Guid.NewGuid().ToString() + "_" + user.Email;
            user.IsActive = false;
            user.IsDeleted = true;

            var count = await _context.SaveChangesAsync();
            return count > 0;
        }

        public async Task<AdminUser> GetAdminUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;
            try
            {
                return await _context.AdminUsers.SingleOrDefaultAsync(x => x.Email == email);
            }
            catch
            {
                return null;
            }
        }

        public async Task UpdateLastLoggedIn(AdminUser user)
        {
            user.LastLoggedIn = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task<AuthToken> CreateAuthTokenAsync(AdminUser adminUser)
        {
            var now = DateTimeOffset.UtcNow;
            var jti = Guid.NewGuid().ToString();
            var secToken = GenerateToken(adminUser, now, jti);

            var refresh = GenerateRefreshToken();

            await _context.RefreshTokens.AddAsync(
                new RefreshToken()
                {
                    Token = refresh,
                    JwtId = jti,
                    CreationDate = now,
                    ExpiryDate = now.AddMinutes(
                        int.Parse(_configuration["JwtTokenSettings:RefreshValidityMinutes"])
                    ),
                    AdminUserID = adminUser.ID,
                }
            );
            await _context.SaveChangesAsync();

            return new AuthToken()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(secToken),
                Expiration = now.AddMinutes(
                    int.Parse(_configuration["JwtTokenSettings:TokenValidityMinutes"])
                ),
                RefreshToken = refresh,
                RefreshTokenExpires = now.AddMinutes(
                    int.Parse(_configuration["JwtTokenSettings:RefreshValidityMinutes"])
                ),
                Name = adminUser.FirstName,
            };
        }

        private JwtSecurityToken GenerateToken(AdminUser adminUser, DateTimeOffset now, string jti)
        {
            if (adminUser.IsDeleted || !adminUser.IsActive)
                return null;

            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, adminUser.Email),
                new Claim(JwtRegisteredClaimNames.Jti, jti),
            };

            var signingKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtTokenSettings:Key"])
            );
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtTokenSettings:Issuer"],
                audience: _configuration["JwtTokenSettings:Audience"],
                expires: now.AddMinutes(
                    int.Parse(_configuration["JwtTokenSettings:TokenValidityMinutes"])
                ).UtcDateTime,
                claims: claims,
                signingCredentials: new Microsoft.IdentityModel.Tokens.SigningCredentials(
                    signingKey,
                    SecurityAlgorithms.HmacSha256
                )
            );
            return token;
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["JwtTokenSettings:Key"])
                ),
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(
                token,
                tokenValidationParameters,
                out SecurityToken securityToken
            );
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (
                jwtSecurityToken == null
                || !jwtSecurityToken.Header.Alg.Equals(
                    SecurityAlgorithms.HmacSha256,
                    StringComparison.InvariantCultureIgnoreCase
                )
            )
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        public async Task<AdminUser> GetAdminUserFromTokenAsync(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);

            return await UserFromJwtAsync(principal);
        }

        private string GenerateRefreshToken()
        {
            var token = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(token);
                return Convert.ToBase64String(token);
            }
        }

        public async Task<bool> ValidateRefreshTokenAsync(string token, string refreshtoken)
        {
            var au = await GetAdminUserFromTokenAsync(token);
            var jti = GetJtiFromJwt(token);
            if (
                await _context.RefreshTokens.AnyAsync(x =>
                    x.Token == refreshtoken
                    && !x.Used
                    && !x.Invalidated
                    && x.ExpiryDate > DateTimeOffset.UtcNow
                    && x.JwtId == jti
                    && x.AdminUserID == au.ID
                )
                && au.IsActive
                && !au.IsDeleted
            )
            {
                var r = await _context.RefreshTokens.FirstAsync(x =>
                    x.Token == refreshtoken
                    && !x.Used
                    && !x.Invalidated
                    && x.ExpiryDate > DateTimeOffset.UtcNow
                    && x.JwtId == jti
                    && x.AdminUserID == au.ID
                );
                await UseRefreshTokenAsync(r.ID);
                return true;
            }
            return false;
        }

        public async Task RemoveRefreshTokenAsync(AdminUser adminUser, string token)
        {
            var jti = GetJtiFromJwt(token);
            if (adminUser == null || jti == null)
                return;
            var rs = _context
                .RefreshTokens.Where(x => x.AdminUserID == adminUser.ID && x.JwtId == jti)
                .ToList();
            foreach (var r in rs)
            {
                r.Invalidated = true;
            }
            await _context.SaveChangesAsync();
        }

        private async Task UseRefreshTokenAsync(Guid refreshTokenId)
        {
            var r = await _context.RefreshTokens.FindAsync(refreshTokenId);
            if (r == null)
                return;
            r.Used = true;
            await _context.SaveChangesAsync();
        }

        public async Task<AdminUser> UserFromJwtAsync(ClaimsPrincipal user = null)
        {
            if (user == null)
                return null;
            if (
                string.IsNullOrEmpty(
                    user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                )
            )
                return null;
            var u = await GetAdminUserByEmailAsync(
                user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value.ToUpper()
            );
            return u;
        }

        private string GetJtiFromJwt(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["JwtTokenSettings:Key"])
                ),
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(
                token,
                tokenValidationParameters,
                out SecurityToken securityToken
            );
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (
                jwtSecurityToken == null
                || !jwtSecurityToken.Claims.Any(claim => claim.Type == "jti")
            )
                return null;
            return jwtSecurityToken.Claims.First(claim => claim.Type == "jti").Value;
        }
    }
}
