using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers;

public class DepartmentController : BaseApiController
{
    private readonly IDepartmentService _departmentSerivce;
    public DepartmentController(IDepartmentService departmentSerivce)
    {
        _departmentSerivce = departmentSerivce;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<DepartmentDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
    {
        var result = await _departmentSerivce.GetAll(pageSize: pageSize, pageNumber: pageNumber);
        if (result == null) return NotFound();
        return Ok(
            new ApiResponseWithPagination<IEnumerable<DepartmentDTO>>
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
    public async Task<ActionResult<ApiResponse<DepartmentDTO>>> GetById(int id)
    {
        var result = await _departmentSerivce.GetById(id);
        return Ok(
             new ApiResponse<DepartmentDTO>
             {
                 Status = Constants.SUCCESS_READ_CODE,
                 Message = Constants.SUCCESS_READ_MSG,
                 Data = result
             }
        );
    }
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DepartmentDTO>>> Create([FromForm] DepartmentRequest request)
    {
        var result = await _departmentSerivce.Create(request);
        return Ok(
            new ApiResponse<DepartmentDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = result
            }
        );
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<DepartmentDTO>>> Update(int id, [FromForm] DepartmentRequest request)
    {
        var result = await _departmentSerivce.Update(id, request);
        return Ok(
            new ApiResponse<DepartmentDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = result
            }
        );
    }
    [HttpPut("DeleteById/{id:int}")]
    public async Task<ActionResult<ApiResponse<DepartmentDTO>>> DeleteById(int id)
    {
        var result = await _departmentSerivce.DeleteById(id);
        return Ok(
            new ApiResponse<DepartmentDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = result
            }
        );
    }
}
