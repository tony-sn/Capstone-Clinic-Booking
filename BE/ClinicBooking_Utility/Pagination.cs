namespace ClinicBooking_Utility
{
    public class Pagination
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; } = 1;

        public int TotalItems { get; set; }
        public int TotalPages => (PageSize > 0) ? (int)Math.Ceiling((double)TotalItems / PageSize) : 1;
    }
    public class PageResultUlt<T>
    {
        public T Items { get; set; }
        public int TotalItems { get; set; }
    }
}