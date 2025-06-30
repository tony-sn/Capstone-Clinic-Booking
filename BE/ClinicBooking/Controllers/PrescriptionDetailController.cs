using ClinicBooking.Models;
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
    public class PrescriptionDetailController : ControllerBase
    {
        private readonly IPrescriptionDetailService _prescriptionDetailService;

        public PrescriptionDetailController(IPrescriptionDetailService prescriptionDetailService)
        {
            _prescriptionDetailService = prescriptionDetailService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<PrescriptionDetailDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _prescriptionDetailService.GetAll(pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<PrescriptionDetailDTO>>
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

        [HttpGet("GetByPrescriptionId/{id:int}")]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<PrescriptionDetailDTO>>>> GetAllByPrescriptionId(int id, int pageSize = 5, int pageNumber = 1)
        {
            var result = await _prescriptionDetailService.GetAllByPrescriptionId(id, pageSize, pageNumber);
            if (result == null) return NotFound();

            return Ok(new ApiResponseWithPagination<IEnumerable<PrescriptionDetailDTO>>
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

        [HttpGet("{prescriptionId:int}/{medicineId:int}")]
        public async Task<ActionResult<ApiResponse<PrescriptionDetailDTO>>> GetById(int prescriptionId, int medicineId)
        {
            var result = await _prescriptionDetailService.GetById(prescriptionId, medicineId);
            return Ok(new ApiResponse<PrescriptionDetailDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<PrescriptionDetailDTO>>> Create([FromForm] PrescriptionDetailRequest request)
        {
            var result = await _prescriptionDetailService.Create(request);
            return Ok(new ApiResponse<PrescriptionDetailDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = result
            });
        }

        [HttpPut("{prescriptionId:int}/{medicineId:int}")]
        public async Task<ActionResult<ApiResponse<PrescriptionDetailDTO>>> Update(int prescriptionId, int medicineId, [FromForm] PrescriptionDetailRequest request)
        {
            var result = await _prescriptionDetailService.Update(prescriptionId, medicineId, request);
            return Ok(
                new ApiResponse<PrescriptionDetailDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
        [HttpPut("DeleteById/{prescriptionId:int}/{medicineId:int}")]
        public async Task<ActionResult<ApiResponse<PrescriptionDetailDTO>>> DeleteById(int prescriptionId, int medicineId)
        {
            var result = await _prescriptionDetailService.DeleteById(prescriptionId, medicineId) ;
            return Ok(
                new ApiResponse<PrescriptionDetailDTO>
                {
                    Status = Constants.SUCCESS_UPDATE_CODE,
                    Message = Constants.SUCCESS_UPDATE_MSG,
                    Data = result
                }
            );
        }
    }
}
