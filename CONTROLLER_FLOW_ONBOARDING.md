# .NET Controller Flow Patterns - Developer Onboarding Guide

## Overview

This clinic booking system follows a consistent three-layer architecture pattern: **Controller → Service → Repository → Database**. This guide explains the architectural patterns, common practices, and coding standards that new developers should understand and follow.

## Architecture Overview

### Three-Layer Architecture

```
Frontend Request → Controller → Service → Repository → Database
                      ↓           ↓          ↓
                   HTTP/API   Business    Data Access
                   Layer      Logic       Layer
```

### Key Components

1. **Controllers** (`/Controllers/`): Handle HTTP requests/responses, validation, and API formatting
2. **Services** (`/Services/`): Contain business logic and orchestrate repository calls
3. **Repositories** (`/Repositories/`): Handle data access and Entity Framework operations
4. **Models** (`/Models/`): Entity definitions and database models
5. **DTOs** (`/Models/DTOs/`): Data Transfer Objects for API communication

## Dependency Injection Pattern

All layers use constructor dependency injection following the interface segregation principle:

```csharp
// Controller depends on Service Interface
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _service;
    
    public AppointmentController(IAppointmentService service)
    {
        _service = service;
    }
}

// Service depends on Repository Interface
public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;
    
    public AppointmentService(IAppointmentRepository repository)
    {
        _repository = repository;
    }
}

// Repository depends on DbContext
public class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _context;
    
    public AppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }
}
```

### DI Registration (Program.cs)

```csharp
// All services registered as Scoped
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();
// ... etc
```

## Controller Patterns

### 1. Standard Controller Structure

**AppointmentController** (Primary Example):

```csharp
[Route("api/[controller]")]
[ApiController]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _service;

    public AppointmentController(IAppointmentService service)
    {
        _service = service;
    }
    
    // CRUD endpoints follow consistent patterns...
}
```

**Alternative Pattern** (Some controllers inherit from BaseApiController):

```csharp
// DoctorController extends BaseApiController
public class DoctorController : BaseApiController
{
    // Same patterns but inherits route and controller attributes
}
```

### 2. Standard CRUD Endpoints

#### GET All (with Pagination)

```csharp
[HttpGet]
public async Task<ActionResult<ApiResponseWithPagination<IEnumerable<AppointmentDTO>>>> GetAll(
    int pageSize = 5,
    int pageNumber = 1,
    // Additional filter parameters...
    AppointmentStatus? status = null,
    DateTime? startDate = null,
    DateTime? endDate = null,
    int? doctorId = null,
    int? departmentId = null,
    int? patientId = null)
{
    try
    {
        var result = await _service.GetAll(pageSize, pageNumber, status, startDate, endDate, doctorId, departmentId, patientId);
        
        if (result == null)
            return NotFound(new ApiResponse<string>
            {
                Status = Constants.FAIL_READ_CODE,
                Message = "No appointments found",
                Data = null,
            });
            
        return Ok(new ApiResponseWithPagination<IEnumerable<AppointmentDTO>>
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
        });
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new ApiResponse<string>
        {
            Status = Constants.FAIL_READ_CODE,
            Message = ex.Message,
            Data = null,
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new ApiResponse<string>
        {
            Status = Constants.FAIL_READ_CODE,
            Message = "An error occurred while retrieving appointments",
            Data = ex.Message,
        });
    }
}
```

#### GET by ID

```csharp
[HttpGet("{id:int}")]
public async Task<ActionResult<ApiResponse<AppointmentDTO>>> GetById(int id)
{
    try
    {
        if (id <= 0)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_READ_CODE,
                Message = "Invalid appointment ID",
                Data = null,
            });
        }

        var item = await _service.GetById(id);
        if (item == null)
            return NotFound(new ApiResponse<string>
            {
                Status = Constants.FAIL_READ_CODE,
                Message = $"Appointment with ID {id} not found",
                Data = null,
            });
            
        return Ok(new ApiResponse<AppointmentDTO>
        {
            Status = Constants.SUCCESS_READ_CODE,
            Message = Constants.SUCCESS_READ_MSG,
            Data = item,
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new ApiResponse<string>
        {
            Status = Constants.FAIL_READ_CODE,
            Message = "An error occurred while retrieving the appointment",
            Data = ex.Message,
        });
    }
}
```

#### POST (Create)

```csharp
[HttpPost]
public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Create(
    [FromForm] AppointmentRequest request)
{
    try
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_CREATE_CODE,
                Message = "Invalid appointment data",
                Data = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
            });
        }

        // Business logic validation
        if (request.StartTime >= request.EndTime)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_CREATE_CODE,
                Message = "Start time must be before end time",
                Data = null,
            });
        }

        if (request.StartTime < DateTime.Now)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_CREATE_CODE,
                Message = "Cannot create appointments in the past",
                Data = null,
            });
        }

        var created = await _service.Create(request);
        return Ok(new ApiResponse<AppointmentDTO>
        {
            Status = Constants.SUCCESS_CREATE_CODE,
            Message = Constants.SUCCESS_CREATE_MSG,
            Data = created,
        });
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new ApiResponse<string>
        {
            Status = Constants.FAIL_CREATE_CODE,
            Message = ex.Message,
            Data = null,
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new ApiResponse<string>
        {
            Status = Constants.FAIL_CREATE_CODE,
            Message = "An error occurred while creating the appointment",
            Data = ex.Message,
        });
    }
}
```

#### PUT (Update)

```csharp
[HttpPut("{id:int}")]
public async Task<ActionResult<ApiResponse<AppointmentDTO>>> Update(
    int id,
    [FromForm] AppointmentRequest request)
{
    try
    {
        if (id <= 0)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_UPDATE_CODE,
                Message = "Invalid appointment ID",
                Data = null,
            });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_UPDATE_CODE,
                Message = "Invalid appointment data",
                Data = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
            });
        }

        // Business logic validation (same as Create)
        if (request.StartTime >= request.EndTime)
        {
            return BadRequest(new ApiResponse<string>
            {
                Status = Constants.FAIL_UPDATE_CODE,
                Message = "Start time must be before end time",
                Data = null,
            });
        }

        var updated = await _service.Update(id, request);
        return Ok(new ApiResponse<AppointmentDTO>
        {
            Status = Constants.SUCCESS_UPDATE_CODE,
            Message = Constants.SUCCESS_UPDATE_MSG,
            Data = updated,
        });
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new ApiResponse<string>
        {
            Status = Constants.FAIL_UPDATE_CODE,
            Message = ex.Message,
            Data = null,
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new ApiResponse<string>
        {
            Status = Constants.FAIL_UPDATE_CODE,
            Message = "An error occurred while updating the appointment",
            Data = ex.Message,
        });
    }
}
```

#### DELETE (Soft Delete)

```csharp
[HttpPut("DeleteById/{id:int}")]
public async Task<ActionResult<ApiResponse<AppointmentDTO>>> DeleteById(int id)
{
    var deleted = await _service.DeleteById(id);
    return Ok(new ApiResponse<AppointmentDTO>
    {
        Status = Constants.SUCCESS_DELETE_CODE,
        Message = Constants.SUCCESS_DELETE_MSG,
        Data = deleted,
    });
}
```

**Note**: The system uses soft deletes (PUT requests that set `Active = false`) rather than hard deletes.

### 3. Specialized Endpoints Pattern

Controllers often include domain-specific endpoints beyond basic CRUD:

```csharp
// AppointmentController examples:
[HttpGet("by-doctor/{doctorId:int}")]
[HttpGet("by-patient/{patientId:int}")]
[HttpGet("today")]
[HttpGet("upcoming")]
[HttpGet("by-status/{status}")]
```

These follow the same response patterns but with specialized business logic.

## Service Layer Patterns

### 1. Service Structure

```csharp
public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;

    public AppointmentService(IAppointmentRepository repository)
    {
        _repository = repository;
    }

    // Service methods implement business logic
    // and coordinate repository calls
}
```

### 2. Pagination Pattern

```csharp
public async Task<PageResultUlt<IEnumerable<AppointmentDTO>>> GetAll(
    int pageSize = 0, 
    int pageNumber = 1, 
    AppointmentStatus? status = null, 
    DateTime? startDate = null, 
    DateTime? endDate = null, 
    int? doctorId = null, 
    int? departmentId = null, 
    int? patientId = null)
{
    // Validation
    if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
    if (pageNumber <= 0) throw new ArgumentException($"invalid page number:{pageNumber}");
    
    // Get data from repository
    var list = await _repository.GetAllAsync(status, startDate, endDate, doctorId, departmentId, patientId);
    if (list == null) return null;
    
    var totalItems = list.Count();
    
    // Apply pagination
    if (pageSize > 0)
    {
        list = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
    }

    return new PageResultUlt<IEnumerable<AppointmentDTO>>
    {
        Items = list.Select(x => AppointmentDTO.ConvertToDTO(x)),
        TotalItems = totalItems
    };
}
```

### 3. DTO Conversion Pattern

Services are responsible for converting entities to DTOs:

```csharp
public async Task<AppointmentDTO> GetById(int id)
{
    var item = await _repository.GetById(id);
    if (item == null) throw new ArgumentException($"invalid Id:{id}");
    return AppointmentDTO.ConvertToDTO(item);
}

public async Task<AppointmentDTO> Create(AppointmentRequest request)
{
    // Map request to entity
    var entity = new Appointment
    {
        DoctorId = request.DoctorId,
        BookByUserID = request.BookByUserId,
        StartTime = request.StartTime,
        EndTime = request.EndTime,
        Price = request.Price,
        AppointmentStatus = request.AppointmentStatus,
        MedicalHistoryId = request.MedicalHistoryId,
        // Navigation properties set to null (EF will resolve)
        Doctor = null,
        BookByUser = null,
        MedicalHistory = null,
    };
    
    var created = await _repository.Create(entity);
    return AppointmentDTO.ConvertToDTO(created);
}
```

## Repository Layer Patterns

### 1. Repository Structure

```csharp
public class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _context;

    public AppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Data access methods...
}
```

### 2. Include Pattern (Eager Loading)

All repository methods consistently load related entities:

```csharp
public async Task<IEnumerable<Appointment>> GetAllAsync()
{
    return await _context.Appointments
        .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
        .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
        .Include(a => a.BookByUser)
        .ToListAsync();
}

public async Task<Appointment?> GetById(int id)
{
    return await _context.Appointments
        .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
        .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
        .Include(a => a.BookByUser)
        .FirstOrDefaultAsync(a => a.AppointmentID == id);
}
```

### 3. Filtering with LINQ

```csharp
public async Task<IEnumerable<Appointment>> GetAllAsync(
    AppointmentStatus? status = null, 
    DateTime? startDate = null, 
    DateTime? endDate = null, 
    int? doctorId = null, 
    int? departmentId = null, 
    int? patientId = null)
{
    var query = _context.Appointments
        .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
        .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
        .Include(a => a.BookByUser)
        .AsQueryable();

    if (status.HasValue)
    {
        query = query.Where(a => a.AppointmentStatus == status.Value);
    }

    if (startDate.HasValue)
    {
        query = query.Where(a => a.StartTime >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(a => a.StartTime <= endDate.Value);
    }

    if (doctorId.HasValue)
    {
        query = query.Where(a => a.DoctorId == doctorId.Value);
    }

    if (departmentId.HasValue)
    {
        query = query.Where(a => a.Doctor.DepartmentID == departmentId.Value);
    }

    if (patientId.HasValue)
    {
        query = query.Where(a => a.BookByUserID == patientId.Value);
    }

    return await query.OrderBy(a => a.StartTime).ToListAsync();
}
```

### 4. Create/Update Pattern

```csharp
public async Task<Appointment> Create(Appointment appointment)
{
    await _context.Appointments.AddAsync(appointment);
    await _context.SaveChangesAsync();
    
    // Reload with related entities after creation
    var createdAppointment = await _context.Appointments
        .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
        .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
        .Include(a => a.BookByUser)
        .FirstOrDefaultAsync(a => a.AppointmentID == appointment.AppointmentID);
        
    return createdAppointment ?? appointment;
}

public async Task<Appointment> Update(int id, Appointment appointment)
{
    try
    {
        if (id != appointment.AppointmentID)
            throw new ArgumentException($"invalid id: {id}");
            
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
        
        // Reload with related entities after update
        var updatedAppointment = await _context.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.Department)
            .Include(a => a.BookByUser)
            .FirstOrDefaultAsync(a => a.AppointmentID == id);
            
        return updatedAppointment ?? appointment;
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        throw;
    }
}
```

### 5. Soft Delete Pattern

```csharp
public async Task<Appointment> DeleteById(int id)
{
    var item = await _context.Appointments
        .Include(a => a.Doctor)
            .ThenInclude(d => d.User)
        .Include(a => a.Doctor)
            .ThenInclude(d => d.Department)
        .Include(a => a.BookByUser)
        .FirstOrDefaultAsync(a => a.AppointmentID == id);
        
    if (item == null) throw new ArgumentException($"invalid id: {id}");
    
    item.Active = false;  // Soft delete
    await _context.SaveChangesAsync();
    return item;
}
```

## Response Formatting Patterns

### 1. ApiResponse Classes

```csharp
// Single item response
public class ApiResponse<T>
{
    public HttpStatusCode Status { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
}

// Paginated response
public class ApiResponseWithPagination<T>
{
    public HttpStatusCode Status { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public Pagination Pagination { get; set; }
}
```

### 2. Pagination Classes

```csharp
public class Pagination
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; } = 1;
    public int TotalItems { get; set; }
    public int TotalPages => (PageSize > 0) ? (int)Math.Ceiling((double)TotalItems / PageSize) : 1;
}

public class PageResultUlt<T>
{
    public T Items { get; set; }
    public int TotalItems { get; set; }
}
```

### 3. Constants

```csharp
public static class Constants
{
    // Success Codes
    public static HttpStatusCode SUCCESS_CREATE_CODE = HttpStatusCode.Created;
    public static string SUCCESS_CREATE_MSG = "Save data success";
    public static HttpStatusCode SUCCESS_READ_CODE = HttpStatusCode.OK;
    public static string SUCCESS_READ_MSG = "Get data success";
    public static HttpStatusCode SUCCESS_UPDATE_CODE = HttpStatusCode.Accepted;
    public static string SUCCESS_UPDATE_MSG = "Update data success";
    public static HttpStatusCode SUCCESS_DELETE_CODE = HttpStatusCode.NoContent;
    public static string SUCCESS_DELETE_MSG = "Delete data success";
    
    // Fail Codes
    public static HttpStatusCode FAIL_CREATE_CODE = HttpStatusCode.BadRequest;
    public static HttpStatusCode FAIL_READ_CODE = HttpStatusCode.BadRequest;
    public static HttpStatusCode FAIL_UPDATE_CODE = HttpStatusCode.BadRequest;
    public static HttpStatusCode FAIL_DELETE_CODE = HttpStatusCode.BadRequest;
    // ... etc
}
```

## DTO and Model Patterns

### 1. Entity Model Pattern

```csharp
public class Appointment : EntityBase
{
    [Key]
    public int AppointmentID { get; set; }
    
    [Required]
    [ForeignKey("Doctor")]
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; }
    
    [Required]
    [ForeignKey("BookByUser")]
    public int BookByUserID { get; set; }
    public User BookByUser { get; set; }
    
    public DateTime StartTime { get; set; }
    
    [Required]
    public DateTime EndTime { get; set; }
    
    public decimal? Price { get; set; }
    
    [Required]
    public AppointmentStatus AppointmentStatus { get; set; }
    
    public int? MedicalHistoryId { get; set; }
    public MedicalHistory MedicalHistory { get; set; }
}
```

### 2. DTO Pattern

```csharp
public class AppointmentDTO
{
    public int Id { get; set; }
    public int DoctorId { get; set; }
    public string? DoctorName { get; set; }
    public string? DoctorCertificate { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public int BookByUserId { get; set; }
    public string? PatientName { get; set; }
    public string? PatientEmail { get; set; }
    public string? PatientPhoneNumber { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Price { get; set; }
    public AppointmentStatus AppointmentStatus { get; set; }
    public int? MedicalHistoryId { get; set; }
    public bool Active { get; set; }

    public static AppointmentDTO ConvertToDTO(Appointment appointment)
    {
        return new AppointmentDTO
        {
            Id = appointment.AppointmentID,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor?.User != null 
                ? $"{appointment.Doctor.User.FirstName} {appointment.Doctor.User.LastName}".Trim() 
                : null,
            DoctorCertificate = appointment.Doctor?.Certificate,
            DepartmentId = appointment.Doctor?.DepartmentID,
            DepartmentName = appointment.Doctor?.Department?.DepartmentName,
            BookByUserId = appointment.BookByUserID,
            PatientName = appointment.BookByUser != null 
                ? $"{appointment.BookByUser.FirstName} {appointment.BookByUser.LastName}".Trim() 
                : null,
            PatientEmail = appointment.BookByUser?.Email,
            PatientPhoneNumber = appointment.BookByUser?.PhoneNumber,
            StartTime = appointment.StartTime,
            EndTime = appointment.EndTime,
            Price = appointment.Price,
            AppointmentStatus = appointment.AppointmentStatus,
            MedicalHistoryId = appointment.MedicalHistoryId,
            Active = appointment.Active
        };
    }
}
```

### 3. Request DTO Pattern

```csharp
public class AppointmentRequest
{
    [Required] 
    public int DoctorId { get; set; }
    
    [Required] 
    public int BookByUserId { get; set; }
    
    public DateTime StartTime { get; set; }
    
    [Required] 
    public DateTime EndTime { get; set; }
    
    public decimal? Price { get; set; }
    
    [Required] 
    public AppointmentStatus AppointmentStatus { get; set; }
    
    public int MedicalHistoryId { get; set; }
}
```

## Error Handling Patterns

### 1. Controller Level Error Handling

Controllers use try-catch blocks with specific exception handling:

```csharp
try
{
    // Business logic
    var result = await _service.SomeMethod();
    return Ok(new ApiResponse<SomeDTO>
    {
        Status = Constants.SUCCESS_READ_CODE,
        Message = Constants.SUCCESS_READ_MSG,
        Data = result,
    });
}
catch (ArgumentException ex)
{
    // Handle validation/business rule violations
    return BadRequest(new ApiResponse<string>
    {
        Status = Constants.FAIL_READ_CODE,
        Message = ex.Message,
        Data = null,
    });
}
catch (Exception ex)
{
    // Handle unexpected errors
    return StatusCode(500, new ApiResponse<string>
    {
        Status = Constants.FAIL_READ_CODE,
        Message = "An error occurred while processing the request",
        Data = ex.Message,
    });
}
```

### 2. Service Level Error Handling

Services throw exceptions for business rule violations:

```csharp
public async Task<AppointmentDTO> GetById(int id)
{
    var item = await _repository.GetById(id);
    if (item == null) throw new ArgumentException($"invalid Id:{id}");
    return AppointmentDTO.ConvertToDTO(item);
}
```

### 3. Repository Level Error Handling

Repositories include validation and let EF exceptions bubble up:

```csharp
public async Task<Appointment> Update(int id, Appointment appointment)
{
    try
    {
        if (id != appointment.AppointmentID)
            throw new ArgumentException($"invalid id: {id}");
            
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
        
        // Reload and return...
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        throw;
    }
}
```

## Validation Patterns

### 1. Model Validation

Controllers check ModelState for request validation:

```csharp
if (!ModelState.IsValid)
{
    return BadRequest(new ApiResponse<string>
    {
        Status = Constants.FAIL_CREATE_CODE,
        Message = "Invalid appointment data",
        Data = string.Join(", ", ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)),
    });
}
```

### 2. Business Logic Validation

Controllers include business rule validation:

```csharp
if (request.StartTime >= request.EndTime)
{
    return BadRequest(new ApiResponse<string>
    {
        Status = Constants.FAIL_CREATE_CODE,
        Message = "Start time must be before end time",
        Data = null,
    });
}

if (request.StartTime < DateTime.Now)
{
    return BadRequest(new ApiResponse<string>
    {
        Status = Constants.FAIL_CREATE_CODE,
        Message = "Cannot create appointments in the past",
        Data = null,
    });
}
```

### 3. Parameter Validation

```csharp
if (id <= 0)
{
    return BadRequest(new ApiResponse<string>
    {
        Status = Constants.FAIL_READ_CODE,
        Message = "Invalid appointment ID",
        Data = null,
    });
}
```

## Comparison Across Controllers

### AppointmentController vs MedicineController vs DoctorController

| Pattern | AppointmentController | MedicineController | DoctorController |
|---------|----------------------|-------------------|------------------|
| **Base Class** | `ControllerBase` | `ControllerBase` | `BaseApiController` |
| **Error Handling** | Comprehensive try-catch | Minimal (relies on middleware) | Minimal (relies on middleware) |
| **Validation** | Extensive business logic validation | Basic ModelState only | Basic ModelState only |
| **Custom Endpoints** | Many (by-doctor, today, upcoming, etc.) | None beyond CRUD | Filter by department |
| **Response Format** | Consistent ApiResponse pattern | Consistent ApiResponse pattern | Consistent ApiResponse pattern |

**Key Insight**: AppointmentController is the most robust example with comprehensive error handling and validation. Other controllers are simpler but follow the same core patterns.

## Best Practices for New Developers

### 1. When Adding New Controllers

1. **Choose Base Class**: Use `ControllerBase` for full control or `BaseApiController` for consistency
2. **Follow Naming**: `[EntityName]Controller`
3. **Inject Service**: Always inject via interface (`I[EntityName]Service`)
4. **Standard Routes**: Use `[Route("api/[controller]")]` and `[ApiController]`

### 2. Implement Standard CRUD

```csharp
[HttpGet] // GetAll with pagination
[HttpGet("{id:int}")] // GetById
[HttpPost] // Create
[HttpPut("{id:int}")] // Update
[HttpPut("DeleteById/{id:int}")] // Soft Delete
```

### 3. Error Handling Strategy

- **Use try-catch in controllers** for comprehensive error handling
- **Return consistent ApiResponse format**
- **Handle ArgumentException for business logic violations**
- **Use 500 status for unexpected errors**

### 4. Validation Strategy

- **Check ModelState.IsValid** for request validation
- **Add business logic validation** in controller
- **Validate parameters** (IDs, required fields)
- **Return descriptive error messages**

### 5. Service Layer Practices

- **Implement all interface methods**
- **Handle DTO conversion** in service
- **Throw ArgumentException** for validation failures
- **Call repository methods** for data access

### 6. Repository Layer Practices

- **Always Include related entities** for DTOs
- **Use consistent Include patterns**
- **Implement filtering with LINQ**
- **Reload entities after Create/Update** to get navigation properties
- **Use soft deletes** (set Active = false)

### 7. Response Consistency

- **Always use ApiResponse/ApiResponseWithPagination**
- **Use Constants for status codes and messages**
- **Include pagination for collections**
- **Return appropriate HTTP status codes**

## Common Pitfalls to Avoid

### 1. Inconsistent Error Handling

❌ **Wrong**: Inconsistent error responses
```csharp
// Don't do this
catch (Exception ex)
{
    return BadRequest(ex.Message); // Inconsistent format
}
```

✅ **Right**: Consistent ApiResponse format
```csharp
catch (Exception ex)
{
    return StatusCode(500, new ApiResponse<string>
    {
        Status = Constants.FAIL_READ_CODE,
        Message = "An error occurred while processing the request",
        Data = ex.Message,
    });
}
```

### 2. Missing Validation

❌ **Wrong**: No validation
```csharp
[HttpPost]
public async Task<ActionResult<ApiResponse<EntityDTO>>> Create([FromForm] EntityRequest request)
{
    var result = await _service.Create(request); // No validation
    return Ok(result);
}
```

✅ **Right**: Comprehensive validation
```csharp
[HttpPost]
public async Task<ActionResult<ApiResponse<EntityDTO>>> Create([FromForm] EntityRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new ApiResponse<string>
        {
            Status = Constants.FAIL_CREATE_CODE,
            Message = "Invalid data",
            Data = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
        });
    }
    
    // Additional business logic validation here
    
    var result = await _service.Create(request);
    return Ok(new ApiResponse<EntityDTO>
    {
        Status = Constants.SUCCESS_CREATE_CODE,
        Message = Constants.SUCCESS_CREATE_MSG,
        Data = result,
    });
}
```

### 3. Forgetting Related Entities

❌ **Wrong**: Missing Include statements
```csharp
public async Task<Entity> GetById(int id)
{
    return await _context.Entities
        .FirstOrDefaultAsync(e => e.Id == id); // Missing related data
}
```

✅ **Right**: Include related entities
```csharp
public async Task<Entity> GetById(int id)
{
    return await _context.Entities
        .Include(e => e.RelatedEntity)
            .ThenInclude(r => r.NestedEntity)
        .Include(e => e.AnotherRelatedEntity)
        .FirstOrDefaultAsync(e => e.Id == id);
}
```

### 4. Inconsistent Pagination

❌ **Wrong**: Manual pagination logic
```csharp
// Don't implement pagination differently each time
```

✅ **Right**: Follow the established pagination pattern
```csharp
public async Task<PageResultUlt<IEnumerable<EntityDTO>>> GetAll(int pageSize = 5, int pageNumber = 1)
{
    if (pageSize < 0) throw new ArgumentException($"invalid page size: {pageSize}");
    if (pageNumber <= 0) throw new ArgumentException($"invalid page number:{pageNumber}");
    
    var list = await _repository.GetAllAsync();
    if (list == null) return null;
    
    var totalItems = list.Count();
    if (pageSize > 0)
    {
        list = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
    }

    return new PageResultUlt<IEnumerable<EntityDTO>>
    {
        Items = list.Select(x => EntityDTO.ConvertToDTO(x)),
        TotalItems = totalItems
    };
}
```

### 5. Hard Deletes Instead of Soft Deletes

❌ **Wrong**: Hard delete
```csharp
public async Task<Entity> Delete(int id)
{
    var entity = await _context.Entities.FindAsync(id);
    _context.Entities.Remove(entity); // Hard delete
    await _context.SaveChangesAsync();
    return entity;
}
```

✅ **Right**: Soft delete
```csharp
public async Task<Entity> DeleteById(int id)
{
    var entity = await _context.Entities
        .Include(e => e.RelatedEntities)
        .FirstOrDefaultAsync(e => e.Id == id);
        
    if (entity == null) throw new ArgumentException($"invalid id: {id}");
    
    entity.Active = false; // Soft delete
    await _context.SaveChangesAsync();
    return entity;
}
```

## Summary

This clinic booking system follows a consistent three-layer architecture with well-defined patterns for:

- **Dependency Injection**: Constructor injection with interfaces throughout
- **CRUD Operations**: Standardized endpoints with consistent validation and error handling
- **Response Formatting**: Uniform ApiResponse wrappers with proper HTTP status codes
- **Pagination**: Consistent pagination implementation across all controllers
- **Error Handling**: Comprehensive try-catch with meaningful error messages
- **DTO Mapping**: Entity to DTO conversion in service layer
- **Data Access**: Repository pattern with eager loading of related entities
- **Soft Deletes**: Consistent soft delete implementation

New developers should use **AppointmentController** as the primary reference for implementing robust controllers with comprehensive error handling and validation. For simpler implementations, **MedicineController** and **DoctorController** demonstrate the core patterns without extensive complexity.

The key to success is following these established patterns consistently across all new features and maintaining the separation of concerns between the Controller, Service, and Repository layers.