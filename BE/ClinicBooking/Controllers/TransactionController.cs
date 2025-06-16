using ClinicBooking.Models.DTOs;
using ClinicBooking.Services;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;
        public TransactionController(ITransactionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<TransactionDTO>>>> GetAll(int pageSize = 5, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize: pageSize, pageNumber: pageNumber);
            if (result == null) return NotFound();
            return Ok(new ApiResponseWithPagination<IEnumerable<TransactionDTO>>
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
        public async Task<ActionResult<ApiResponse<TransactionDTO>>> GetById(int id)
        {
            var item = await _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(new ApiResponse<TransactionDTO>
            {
                Status = Constants.SUCCESS_READ_CODE,
                Message = Constants.SUCCESS_READ_MSG,
                Data = item
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TransactionDTO>>> Post([FromForm] TransactionRequest transaction)
        {
            var created = await _service.Create(transaction);
            return Ok(new ApiResponse<TransactionDTO>
            {
                Status = Constants.SUCCESS_CREATE_CODE,
                Message = Constants.SUCCESS_CREATE_MSG,
                Data = created
            });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<TransactionDTO>>> Put(int id, [FromForm] TransactionRequest transaction)
        {
            var updated = await _service.Update(id, transaction);
            return Ok(new ApiResponse<TransactionDTO>
            {
                Status = Constants.SUCCESS_UPDATE_CODE,
                Message = Constants.SUCCESS_UPDATE_MSG,
                Data = updated
            });
        }

        [HttpPut("DeleteById/{id}")]
        public async Task<ActionResult<ApiResponse<TransactionDTO>>> Delete(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(new ApiResponse<TransactionDTO>
            {
                Status = Constants.SUCCESS_DELETE_CODE,
                Message = Constants.SUCCESS_DELETE_MSG,
                Data = deleted
            });
        }
    }
}