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
        public async Task<ActionResult<ApiResponse<IEnumerable<RevenueReportDTO>>>> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(new ApiResponse<IEnumerable<RevenueReportDTO>>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Get(int id)
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
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Post([FromBody] RevenueReportRequest report)
        {
            var created = await _service.Create(report);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Put(int id, [FromBody] RevenueReportRequest report)
        {
            var updated = await _service.Update(id, report);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<RevenueReportDTO>>> Delete(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(new ApiResponse<RevenueReportDTO>
            {
                Status = Constants.SUCCESS_DELETE_CODE,
                Message = Constants.SUCCESS_DELETE_MSG,
                Data = deleted
            });
        }
    }
}