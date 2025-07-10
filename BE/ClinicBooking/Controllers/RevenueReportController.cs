using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueReportController : ControllerBase
    {
        private readonly IRevenueReportService _service;
        public RevenueReportController(IRevenueReportService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<RevenueReportDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize: pageSize, pageNumber: pageNumber);
            if (result == null) return NotFound();
            return Ok(new ApiResponseWithPagination<IEnumerable<RevenueReportDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result.Items,
                Pagination = new Pagination
                {
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    TotalItems = result.TotalItems
                }
            });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> GetById(int id)
        {
            var item = await _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = item
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Create([FromForm] RevenueReportRequest report)
        {
            var created = await _service.Create(report);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Update(int id, [FromForm] RevenueReportRequest report)
        {
            var updated = await _service.Update(id, report);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> DeleteById(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_DELETE_CODE,
                Message = Constants.SUCCESS_DELETE_MSG,
                Data = deleted
            });
        }

        [HttpGet("filter")]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<RevenueReportDTO>>>> FilterByType(RevenueType type, int pageSize = 10, int pageNumber = 1)
        {
            var result = await _service.FilterByType(type, pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<RevenueReportDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result.Items,
                Pagination = new Pagination
                {
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    TotalItems = result.TotalItems
                }
            });
        }
    }
}