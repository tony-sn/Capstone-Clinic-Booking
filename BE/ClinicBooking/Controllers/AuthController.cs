using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
  [Route("api/[controller]")]
  [ApiExplorerSettings(IgnoreApi = false, GroupName = "v1")]
  [ApiController]
  public class AuthController : AuthenticatedController
  {

  };
}