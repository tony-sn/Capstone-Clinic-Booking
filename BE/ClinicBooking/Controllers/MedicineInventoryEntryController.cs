using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking.Services.IServices;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineInventoryEntryController : ControllerBase
    {
        private readonly IMedicineInventoryEntryService _medicineInventoryEntryService;

        public MedicineInventoryEntryController(IMedicineInventoryEntryService medicineInventoryEntryService)
        {
            _medicineInventoryEntryService = medicineInventoryEntryService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<MedicineInventoryEntryDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _medicineInventoryEntryService.GetAll(pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<MedicineInventoryEntryDTO>>
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
        public async Task<ActionResult<ApiResponse<MedicineInventoryEntryDTO>>> GetById(int id)
        {
            var result = await _medicineInventoryEntryService.GetById(id);
            return Ok(new ApiResponse<MedicineInventoryEntryDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<MedicineInventoryEntryDTO>>> Create([FromForm] MedicineInventoryEntryRequest request)
        {
            var result = await _medicineInventoryEntryService.Create(request);
            return Ok(new ApiResponse<MedicineInventoryEntryDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicineInventoryEntryDTO>>> Update(int id, [FromForm] MedicineInventoryEntryRequest request)
        {
            var result = await _medicineInventoryEntryService.Update(id, request);
            return Ok(
                new ApiResponse<MedicineInventoryEntryDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<MedicineInventoryEntryDTO>>> DeleteById(int id)
        {
            var result = await _medicineInventoryEntryService.DeleteById(id);
            return Ok(
                new ApiResponse<MedicineInventoryEntryDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
    }
}
