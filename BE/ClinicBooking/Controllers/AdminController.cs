using ClinicBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Encodings.Web;

namespace ClinicBooking.Controllers;

public class CreateUserDTO
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public List<string> Roles { get; set; } = [];
}

public class AdminController(UserManager<User> userManager, IEmailSender<User> emailSender, LinkGenerator linkGenerator, IHttpContextAccessor httpContextAccessor) : BaseApiController
{
    [Authorize(Policy = "Admin")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

        var selectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByNameAsync(username);

        if (user == null) return NotFound();

        var userRoles = await userManager.GetRolesAsync(user);

        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

        if (!result.Succeeded) return BadRequest("Failed to add to roles");

        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

        if (!result.Succeeded) return BadRequest("Failed to remove from roles");

        return Ok(await userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "Admin")]
    [HttpPost("create-user")]
    public async Task<ActionResult> CreateUser(CreateUserDTO dto)
    {
        var user = new User
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Gán các role nếu có
        if (dto.Roles.Count > 0)
        {
            var roleResult = await userManager.AddToRolesAsync(user, dto.Roles);
            if (!roleResult.Succeeded)
                return BadRequest(roleResult.Errors);
        }

        // Thiết lập cờ yêu cầu đổi mật khẩu
        await userManager.SetLockoutEnabledAsync(user, false);
        await userManager.UpdateSecurityStampAsync(user);
        await userManager.SetAuthenticationTokenAsync(user, "Default", "ForcePasswordChange", "true");

        // Gửi email xác nhận
        var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        var userId = await userManager.GetUserIdAsync(user);
        var confirmUrl = linkGenerator.GetUriByRouteValues(
            httpContextAccessor.HttpContext!,
            routeName: "ConfirmEmail",
            values: new { userId, code },
            scheme: httpContextAccessor.HttpContext.Request.Scheme);

        await emailSender.SendConfirmationLinkAsync(user, user.Email, HtmlEncoder.Default.Encode(confirmUrl));
        return Ok("User created. Password change required on first login.");
    }


    // [Authorize(Policy = "Admin")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

        return Ok(users);
    }
}
