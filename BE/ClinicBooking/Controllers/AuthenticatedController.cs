using ClinicBooking.Entities;
using ClinicBooking.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true, GroupName = "v1")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class AuthenticatedController : Controller
    {
        protected readonly IAuthService _authService;

        protected AdminUser CurrentUser;

        public AuthenticatedController(IAuthService authService)
        {
            _authService = authService;
        }

        [NonAction]
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (User.Identity.IsAuthenticated)
            {
                CurrentUser = _authService.UserFromJwtAsync(User).GetAwaiter().GetResult();
                if (CurrentUser == null || !CurrentUser.IsActive)
                {
                    context.Result = new UnauthorizedObjectResult(
                        new { message = "User not recognised." }
                    );
                }
            }
            //else anonymous access

            //base.OnActionExecuting(context);
        }
    }
}
