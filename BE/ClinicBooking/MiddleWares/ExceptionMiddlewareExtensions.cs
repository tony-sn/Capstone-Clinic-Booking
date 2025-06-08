using System.Net;
using System.Text.Json;
using ClinicBooking_Utility;

namespace ClinicBooking.MiddleWares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            context.Response.ContentType = "application/json";

            object response;
            var innerException = ex.InnerException ?? ex;
            switch (innerException)
            {
                case ArgumentException argEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = new ApiResponse<string>
                    {
                        Message = argEx.Message,
                        Data = null,
                        Status = HttpStatusCode.BadRequest
                    };
                    break;

                case UnauthorizedAccessException authEx:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response = new ApiResponse<string>
                    {
                        Message = authEx.Message,
                        Data = null,
                        Status = HttpStatusCode.Unauthorized
                    };
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response = _env.IsDevelopment()
                        ? new ApiResponse<string>
                        {
                            Message = ex.Message,
                            Data = ex.StackTrace,
                            Status = HttpStatusCode.InternalServerError
                        }
                         : new ApiResponse<string>
                         {
                             Message = "Something went wrong.",
                             Data = null,
                             Status = HttpStatusCode.InternalServerError
                         };
                    //response = new ApiResponse<string>
                    //{
                    //    Message = ex.Message,
                    //    Data = null,
                    //    Status = HttpStatusCode.InternalServerError
                    //};
                    break;
            }

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
        }
    }

    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }

}