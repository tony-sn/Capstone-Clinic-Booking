using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers;

public class DoctorController : BaseApiController
{
    private readonly IDoctorService _doctorSerivce;
    public DoctorController(IDoctorService doctorSerivce)
    {
        _doctorSerivce = doctorSerivce;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<DoctorDTO>>>> GetAll(int? departmentID, int pageSize = 5, int pageNumber = 1)
    {
        var result = await _doctorSerivce.GetAll(departmentID: departmentID, pageSize: pageSize, pageNumber: pageNumber);
        if (result == null) return NotFound();
        return Ok(
            new ApiResponseWithPagination<IEnumerable<DoctorDTO>>
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
            }
            );
    }
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<DoctorDTO>>> GetById(int id)
    {
        var result = await _doctorSerivce.GetById(id);
        return Ok(
             new ApiResponse<DoctorDTO>
             {
                 Status = Constants.SUCCESS_READ_CODE,
                 Message = Constants.SUCCESS_READ_MSG,
                 Data = result
             }
        );
    }
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DoctorDTO>>> Create([FromForm] DoctorRequest request)
    {
        var result = await _doctorSerivce.Create(request);
        return Ok(
            new ApiResponse<DoctorDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = result
            }
        );
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<DoctorDTO>>> Update(int id, [FromForm] DoctorRequest request)
    {
        var result = await _doctorSerivce.Update(id, request);
        return Ok(
            new ApiResponse<DoctorDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = result
            }
        );
    }
    [HttpPut("DeleteById/{id:int}")]
    public async Task<ActionResult<ApiResponse<DoctorDTO>>> DeleteById(int id)
    {
        var result = await _doctorSerivce.DeleteById(id);
        return Ok(
            new ApiResponse<DoctorDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = result
            }
        );
    }
}
