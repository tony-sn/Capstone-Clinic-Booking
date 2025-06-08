

using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LaboratoryTestController : ControllerBase
    {
        private readonly ILaboratoryTestService _laboratoryTestSerivce;
        public LaboratoryTestController(ILaboratoryTestService laboratoryTestSerivce)
        {
            _laboratoryTestSerivce = laboratoryTestSerivce;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<LaboratoryTestDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _laboratoryTestSerivce.GetAll(pageSize: pageSize, pageNumber: pageNumber);
            if (result == null) return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<LaboratoryTestDTO>>
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
        public async Task<ActionResult<ApiResponse<LaboratoryTestDTO>>> GetById(int id)
        {
            var result = await _laboratoryTestSerivce.GetById(id);
            return Ok(
                 new ApiResponse<LaboratoryTestDTO>
                 {
                     Status = Constants.SUCCESS_READ_CODE,
                     Message = Constants.SUCCESS_READ_MSG,
                     Data = result
                 }
            );
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponse<LaboratoryTestDTO>>> Create([FromForm] LaboratoryTestRequest request)
        {
            var result = await _laboratoryTestSerivce.Create(request);
            return Ok(
                new ApiResponse<LaboratoryTestDTO>
                {
                    Status = Constants.SUCCESS_CREATE_CODE,
                    Message = Constants.SUCCESS_CREATE_MSG,
                    Data = result
                }
            );
        }
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<LaboratoryTestDTO>>> Update(int id, [FromForm] LaboratoryTestRequest request)
        {
            var result = await _laboratoryTestSerivce.Update(id, request);
            return Ok(
                new ApiResponse<LaboratoryTestDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<LaboratoryTestDTO>>> DeleteById(int id)
        {
            var result = await _laboratoryTestSerivce.DeleteById(id);
            return Ok(
                new ApiResponse<LaboratoryTestDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
    }


}