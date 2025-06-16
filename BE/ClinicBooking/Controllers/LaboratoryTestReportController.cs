using ClinicBooking.Models.DTOs;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LaboratoryTestReportController : BaseApiController
{

    private readonly ILaboratoryTestReportService _laboratoryTestReportService;

    public LaboratoryTestReportController(ILaboratoryTestReportService laboratoryTestReportService)
    {
        _laboratoryTestReportService = laboratoryTestReportService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLaboratoryTestReportAsync([FromBody] CreateLaboratoryTestReportRequest request)
    {
        var result = await _laboratoryTestReportService.CreateLaboratoryTestReportAsync(request);
        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<LaboratoryTestReportDTO>>> UpdateLaboratoryTestReportAsync([FromBody] UpdateLaboratoryTestReportRequest request)
    {
        var result = await _laboratoryTestReportService.UpdateLaboratoryTestReportAsync(request);
        return Ok(new ApiResponse<LaboratoryTestReportDTO>
        {
            Status = Constants.SUCCESS_UPDATE_CODE,
            Message = Constants.SUCCESS_UPDATE_MSG,
            Data = result
        });
    }

    [HttpPut("Delete/{medicalHistoryId:int}/{laboratoryTestId:int}")]
    public async Task<ActionResult<ApiResponse<LaboratoryTestReportDTO>>> DeleteLaboratoryTestReportAsync(int medicalHistoryId, int laboratoryTestId)
    {
        var result = await _laboratoryTestReportService.DeleteLaboratoryTestReportAsync(medicalHistoryId, laboratoryTestId);
        return Ok(new ApiResponse<LaboratoryTestReportDTO>
        {
            Status = Constants.SUCCESS_DELETE_CODE,
            Message = Constants.SUCCESS_DELETE_MSG,
            Data = result
        });
    }

    [HttpGet("{medicalHistoryId:int}/{laboratoryTestId:int}")]
    public async Task<ActionResult<ApiResponse<LaboratoryTestReportDTO>>> GetLaboratoryTestReportByIdAsync(int medicalHistoryId, int laboratoryTestId)
    {
        var result = await _laboratoryTestReportService.GetLaboratoryTestReportByIdAsync(medicalHistoryId, laboratoryTestId);
        return Ok(new ApiResponse<LaboratoryTestReportDTO>
        {
            Status = Constants.SUCCESS_READ_CODE,
            Message = Constants.SUCCESS_READ_MSG,
            Data = result
        });
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<LaboratoryTestReportDTO>>>> GetAllLaboratoryTestReportsAsync([FromQuery] LaboratoryTestReportFilter filter)
    {
        var result = await _laboratoryTestReportService.GetAllLaboratoryTestReportsAsync(filter);
        return Ok(new ApiResponseWithPagination<IEnumerable<LaboratoryTestReportDTO>>
        {
            Status = Constants.SUCCESS_READ_CODE,
            Message = Constants.SUCCESS_READ_MSG,
            Data = result.Items,
            Pagination = new Pagination
            {
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalItems = result.TotalItems
            }
        });
    }
}