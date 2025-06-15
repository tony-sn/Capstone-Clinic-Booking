using ClinicBooking.Data;
using ClinicBooking.MiddleWares;
using ClinicBooking.Models;
using ClinicBooking.Repositories;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services;
using ClinicBooking.Services.IServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// add DbContext
builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

// Identity & Role
builder.Services.AddIdentityApiEndpoints<User>(opt => opt.User.RequireUniqueEmail = true)
    .AddRoles<Role>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
#region  add dependence injection
builder.Services.AddScoped<ILaboratoryTestRepository, LaboratoryTestRepository>();
builder.Services.AddScoped<ILaboratoryTestService, LaboratoryTestService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddScoped<IMedicineInventoryEntryRepository, MedicineInventoryEntryRepository>();
builder.Services.AddScoped<IMedicineInventoryEntryService, MedicineInventoryEntryService>();
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IPrescriptionDetailService, PrescriptionDetailService>();
#endregion
// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API",
        Version = "v1",
        Description = "API for system"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Insert JWT with Bearer",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    var baseDir = AppDomain.CurrentDomain.BaseDirectory;
    foreach (var file in new DirectoryInfo(baseDir).EnumerateFiles("*.xml"))
        c.IncludeXmlComments(file.FullName);

    c.OrderActionsBy(api => api.RelativePath);
    c.EnableAnnotations();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseExceptionMiddleware();
// Static files
app.UseDefaultFiles();
app.UseStaticFiles();

// Uploads folder
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "Uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

// Auto migrate & seed
using var scope = app.Services.CreateScope();
try
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    await dbContext.Database.MigrateAsync();
}
catch (Exception ex)
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Lỗi khi migrate hoặc seed dữ liệu.");
}

app.Run();
