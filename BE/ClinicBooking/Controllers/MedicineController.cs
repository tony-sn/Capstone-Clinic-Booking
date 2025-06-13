using ClinicBooking.Models.DTOs;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicineController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<MedicineDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _medicineService.GetAll(pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<MedicineDTO>>
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
        public async Task<ActionResult<ApiResponse<MedicineDTO>>> GetById(int id)
        {
            var result = await _medicineService.GetById(id);
            return Ok(new ApiResponse<MedicineDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<MedicineDTO>>> Create([FromForm] MedicineRequest request)
        {
            var result = await _medicineService.Create(request);
            return Ok(new ApiResponse<MedicineDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicineDTO>>> Update(int id, [FromForm] MedicineRequest request)
        {
            var result = await _medicineService.Update(id, request);
            return Ok(
                new ApiResponse<MedicineDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicineDTO>>> DeleteById(int id)
        {
            var result = await _medicineService.DeleteById(id);
            return Ok(
                new ApiResponse<MedicineDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
    }
}
