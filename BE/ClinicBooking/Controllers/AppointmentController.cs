using ClinicBooking_Utility;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;

        public AppointmentController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetAll(
            int pageSize = 5,
            int pageNumber = 1,
            AppointmentStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int? doctorId = null,
            int? departmentId = null,
            int? patientId = null
        )
        {
            try
            {
                var result = await _service.GetAll(
                    pageSize,
                    pageNumber,
                    status,
                    startDate,
                    endDate,
                    doctorId,
                    departmentId,
                    patientId
                );
                if (result == null)
                    return NotFound(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_READ_CODE,
                            Message = "No appointments found",
                            Data = null,
                        }
                    );
                return Ok(
                    new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                    {
                        Status = Constants.SUCCESS_READ_CODE,
                        Message = Constants.SUCCESS_READ_MSG,
                        Data = result.Items,
                        Pagination = new Pagination
                        {
                            PageSize = pageSize,
                            PageNumber = pageNumber,
                            TotalItems = result.TotalItems,
                        },
                    }
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_READ_CODE,
                        Message = ex.Message,
                        Data = null,
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_READ_CODE,
                        Message = "An error occurred while retrieving appointments",
                        Data = ex.Message,
                    }
                );
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> GetById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_READ_CODE,
                            Message = "Invalid appointment ID",
                            Data = null,
                        }
                    );
                }

                var item = await _service.GetById(id);
                if (item == null)
                    return NotFound(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_READ_CODE,
                            Message = $"Appointment with ID {id} not found",
                            Data = null,
                        }
                    );
                return Ok(
                    new ApiResponse<AppointmentDTO>
                    {
                        Status = Constants.SUCCESS_READ_CODE,
                        Message = Constants.SUCCESS_READ_MSG,
                        Data = item,
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_READ_CODE,
                        Message = "An error occurred while retrieving the appointment",
                        Data = ex.Message,
                    }
                );
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Create(
            [FromForm] AppointmentRequest request
        )
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_CREATE_CODE,
                            Message = "Invalid appointment data",
                            Data = string.Join(
                                ", ",
                                ModelState
                                    .Values.SelectMany(v => v.Errors)
                                    .Select(e => e.ErrorMessage)
                            ),
                        }
                    );
                }

                if (request.StartTime >= request.EndTime)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_CREATE_CODE,
                            Message = "Start time must be before end time",
                            Data = null,
                        }
                    );
                }

                if (request.StartTime < DateTime.Now)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_CREATE_CODE,
                            Message = "Cannot create appointments in the past",
                            Data = null,
                        }
                    );
                }

                var created = await _service.Create(request);
                return Ok(
                    new ApiResponse<AppointmentDTO>
                    {
                        Status = Constants.SUCCESS_CREATE_CODE,
                        Message = Constants.SUCCESS_CREATE_MSG,
                        Data = created,
                    }
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_CREATE_CODE,
                        Message = ex.Message,
                        Data = null,
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_CREATE_CODE,
                        Message = "An error occurred while creating the appointment",
                        Data = ex.Message,
                    }
                );
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Update(
            int id,
            [FromForm] AppointmentRequest request
        )
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_UPDATE_CODE,
                            Message = "Invalid appointment ID",
                            Data = null,
                        }
                    );
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_UPDATE_CODE,
                            Message = "Invalid appointment data",
                            Data = string.Join(
                                ", ",
                                ModelState
                                    .Values.SelectMany(v => v.Errors)
                                    .Select(e => e.ErrorMessage)
                            ),
                        }
                    );
                }

                if (request.StartTime >= request.EndTime)
                {
                    return BadRequest(
                        new ApiResponse<string>
                        {
                            Status = Constants.FAIL_UPDATE_CODE,
                            Message = "Start time must be before end time",
                            Data = null,
                        }
                    );
                }

                var updated = await _service.Update(id, request);
                return Ok(
                    new ApiResponse<AppointmentDTO>
                    {
                        Status = Constants.SUCCESS_UPDATE_CODE,
                        Message = Constants.SUCCESS_UPDATE_MSG,
                        Data = updated,
                    }
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_UPDATE_CODE,
                        Message = ex.Message,
                        Data = null,
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new ApiResponse<string>
                    {
                        Status = Constants.FAIL_UPDATE_CODE,
                        Message = "An error occurred while updating the appointment",
                        Data = ex.Message,
                    }
                );
            }
        }

        [HttpPut("DeleteById/{id:int}")]
        public async Task<ActionResult<ApiResponse<AppointmentDTO>>> DeleteById(int id)
        {
            var deleted = await _service.DeleteById(id);
            return Ok(
                new ApiResponse<AppointmentDTO>
                {
                    Status = Constants.SUCCESS_DELETE_CODE,
                    Message = Constants.SUCCESS_DELETE_MSG,
                    Data = deleted,
                }
            );
        }

        [HttpGet("by-doctor/{doctorId:int}")]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetByDoctor(int doctorId, int pageSize = 10, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize, pageNumber, doctorId: doctorId);
            if (result == null)
                return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = result.Items,
                    Pagination = new Pagination
                    {
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        TotalItems = result.TotalItems,
                    },
                }
            );
        }

        [HttpGet("by-patient/{patientId:int}")]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetByPatient(int patientId, int pageSize = 10, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize, pageNumber, patientId: patientId);
            if (result == null)
                return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = result.Items,
                    Pagination = new Pagination
                    {
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        TotalItems = result.TotalItems,
                    },
                }
            );
        }

        [HttpGet("today")]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetToday(int pageSize = 20, int pageNumber = 1)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var result = await _service.GetAll(
                pageSize,
                pageNumber,
                startDate: today,
                endDate: tomorrow
            );
            if (result == null)
                return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = result.Items,
                    Pagination = new Pagination
                    {
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        TotalItems = result.TotalItems,
                    },
                }
            );
        }

        [HttpGet("upcoming")]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetUpcoming(int pageSize = 20, int pageNumber = 1, int days = 7)
        {
            var startDate = DateTime.Now;
            var endDate = startDate.AddDays(days);
            var result = await _service.GetAll(
                pageSize,
                pageNumber,
                startDate: startDate,
                endDate: endDate
            );
            if (result == null)
                return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = result.Items,
                    Pagination = new Pagination
                    {
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        TotalItems = result.TotalItems,
                    },
                }
            );
        }

        [HttpGet("by-status/{status}")]
        public async Task<
            ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>
        > GetByStatus(AppointmentStatus status, int pageSize = 10, int pageNumber = 1)
        {
            var result = await _service.GetAll(pageSize, pageNumber, status: status);
            if (result == null)
                return NotFound();
            return Ok(
                new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
                {
                    Status = Constants.SUCCESS_READ_CODE,
                    Message = Constants.SUCCESS_READ_MSG,
                    Data = result.Items,
                    Pagination = new Pagination
                    {
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        TotalItems = result.TotalItems,
                    },
                }
            );
        }
    }
}
