using System.Net;

namespace ClinicBooking_Utility
{
    public class ApiResponse<T>
    {
        public HttpStatusCode Status { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }
    public class ApiResponseWithPagination<T>
    {
        public HttpStatusCode Status { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public Pagination Pagination { get; set; }
    }

}