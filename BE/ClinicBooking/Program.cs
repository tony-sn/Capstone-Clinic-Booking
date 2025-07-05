using ClinicBooking.Data;
using ClinicBooking.Extensions;
using ClinicBooking.MiddleWares;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Models.Settings;
using ClinicBooking.Repositories;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking.Services;
using ClinicBooking.Services.IServices;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
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
{
    var connectionString = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");
    options.UseSqlServer(connectionString, o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
});

builder.Services.AddDataProtection()
    .SetApplicationName("ClinicBooking")
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "KeyRing")))
    .SetDefaultKeyLifetime(TimeSpan.FromDays(360));

// HTTP, Email, Logging
builder.Services.AddHttpClient();
builder.Services.Configure<EmailSenderSettings>(options =>
{
    var smtpServer = Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_SMTPSERVER") 
                 ?? throw new InvalidOperationException("Missing SMTP server env var");
    options.SmtpServer = smtpServer;
    options.SmtpPort = int.Parse(Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_SMTPPORT") ?? "2525");
    options.EnableSsl = bool.Parse(Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_ENABLESSL") ?? "true");
    options.UserName = Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_USERNAME");
    options.Password = Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_PASSWORD");
    options.From = Environment.GetEnvironmentVariable("EMAILSENDERSETTINGS_FROM");
});



builder.Services.AddTransient(typeof(IEmailSender<>), typeof(EmailSender<>));

// Identity & Role
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", policy => policy.RequireRole("Admin"))
    .AddPolicy("Doctor", policy => policy.RequireRole("Admin", "Doctor"));
builder.Services.AddIdentityApiEndpoints<User>(opt => opt.User.RequireUniqueEmail = true)
    .AddRoles<Role>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

#region add dependence injection

builder.Services.AddScoped<ILaboratoryTestRepository, LaboratoryTestRepository>();
builder.Services.AddScoped<ILaboratoryTestReportRepository, LaboratoryTestReportRepository>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ILaboratoryTestReportService, LaboratoryTestReportService>();
builder.Services.AddScoped<ILaboratoryTestService, LaboratoryTestService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddScoped<IMedicalHistoryRepository, MedicalHistoryRepository>();
builder.Services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
builder.Services.AddScoped<IMedicineInventoryEntryRepository, MedicineInventoryEntryRepository>();
builder.Services.AddScoped<IMedicineInventoryEntryService, MedicineInventoryEntryService>();
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IPrescriptionDetailRepositiory, PrescriptionDetailRepositiory>();
builder.Services.AddScoped<IPrescriptionDetailService, PrescriptionDetailService>();
builder.Services.AddScoped<IRevenueReportRepository, RevenueReportRepository>();
builder.Services.AddScoped<IRevenueReportService, RevenueReportService>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
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

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
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

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsPolicyBuilder =>
    {
        corsPolicyBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddHealthChecks();

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
app.UseCors();
app.UseHttpsRedirection();


app.UseAuthorization();

app.MapHealthChecks("/health");

app.MapControllers();
app.MapGroup("api").MapCustomIdentityApi<User>();

// Auto migrate & seed
using var scope = app.Services.CreateScope();
try
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

    await dbContext.Database.MigrateAsync();
    await DbInitializer.SeedData(dbContext, userMgr, roleMgr);
}
catch (Exception ex)
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Lỗi khi migrate hoặc seed dữ liệu.");
}

app.Run();