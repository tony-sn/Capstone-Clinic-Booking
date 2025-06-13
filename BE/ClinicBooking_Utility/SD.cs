using System.Net;

namespace ClinicBooking_Utility
{
    public static class Constants
    {
        #region ErrorCodes
        public static HttpStatusCode ERROR_EXCEPTION = HttpStatusCode.ExpectationFailed;
        #endregion

        #region Success Codes

        public static HttpStatusCode SUCCESS_CREATE_CODE = HttpStatusCode.Created;
        public static string SUCCESS_CREATE_MSG = "Save data success";
        public static HttpStatusCode SUCCESS_READ_CODE = HttpStatusCode.OK;
        public static string SUCCESS_READ_MSG = "Get data success";
        public static HttpStatusCode SUCCESS_UPDATE_CODE = HttpStatusCode.Accepted;
        public static string SUCCESS_UPDATE_MSG = "Update data success";
        public static HttpStatusCode SUCCESS_DELETE_CODE = HttpStatusCode.NoContent;
        public static string SUCCESS_DELETE_MSG = "Delete data success";
        #endregion
        #region Fail code

        public static HttpStatusCode FAIL_CREATE_CODE = HttpStatusCode.BadRequest;
        public static string FAIL_CREATE_MSG = "Save data fail";
        public static HttpStatusCode FAIL_READ_CODE = HttpStatusCode.BadRequest;
        public static string FAIL_READ_MSG = "Get data fail";
        public static HttpStatusCode FAIL_UPDATE_CODE = HttpStatusCode.BadRequest;
        public static string FAIL_UPDATE_MSG = "Update data fail";
        public static HttpStatusCode FAIL_DELETE_CODE = HttpStatusCode.BadRequest;
        public static string FAIL_DELETE_MSG = "Delete data fail";

        #endregion

        #region Warning Code

        public static HttpStatusCode WARNING_NO_DATA_CODE = HttpStatusCode.NoContent;
        public static string WARNING_NO_DATA__MSG = "No data";

        #endregion

    }
}
