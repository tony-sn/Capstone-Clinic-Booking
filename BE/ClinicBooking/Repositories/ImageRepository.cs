using System.Threading.Tasks;
using ClinicBooking.Data;
using ClinicBooking.Models;
using ClinicBooking.Models.DTOs;
using ClinicBooking.Repositories.IRepositories;
using ClinicBooking_Utility;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly ApplicationDbContext _context;
        public ImageRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Image> CreateImageAsync(CreateImageRequest request)
        {
            if (request.File == null)
                throw new ArgumentException("Image file is required.");
            var existingLaboratoryTest = await _context.LaboratoryTests.FirstOrDefaultAsync(x => x.LaboratoryTestId == request.LaboratoryTestReportLaboratoryTestId);
            if (existingLaboratoryTest == null)
                throw new ArgumentException("Laboratory test not found.");
            var existingMedicalHistory = await _context.MedicalHistories.FirstOrDefaultAsync(x => x.MedicalHistoryId == request.LaboratoryTestReportMedicalHistoryId);
            if (existingMedicalHistory == null)
                throw new ArgumentException("Medical history not found.");
            var item = await _context.LaboratoryTestReports.AsNoTracking().FirstOrDefaultAsync(x => x.MedicalHistoryId == request.LaboratoryTestReportMedicalHistoryId && x.LaboratoryTestId == request.LaboratoryTestReportLaboratoryTestId);
            if (item == null)
            {
                throw new ArgumentException($"Laboratory test report not found with the given medical historyID {request.LaboratoryTestReportMedicalHistoryId} and laboratory test ID: {request.LaboratoryTestReportLaboratoryTestId}.");
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var key = $"{request.LaboratoryTestReportLaboratoryTestId}_{request.LaboratoryTestReportMedicalHistoryId}";
                var (filePath, fileName, fileExtension) = await GetImagePath(key, request.File);

                var image = new Image
                {
                    FileName = fileName,
                    FileExtension = fileExtension,
                    Path = filePath,
                    LaboratoryTestReportLaboratoryTestId = request.LaboratoryTestReportLaboratoryTestId,
                    LaboratoryTestReportMedicalHistoryId = request.LaboratoryTestReportMedicalHistoryId
                };
                await _context.Images.AddAsync(image);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return image;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }

        }

        public async Task<Image> DeleteImageAsync(int imageId)
        {
            var image = await _context.Images.AsNoTracking().FirstOrDefaultAsync(x => x.ImageID == imageId);
            image.Active = false;
            _context.Images.Update(image);
            await _context.SaveChangesAsync();
            return image;
        }

        public async Task<PageResultUlt<IEnumerable<Image>>> GetAllImagesAsync(int pageSize, int pageNumber)
        {
            var query = _context.Images.AsQueryable();
            var totalCount = query.Count();
            if (pageSize > 0)
                query = query.Skip(pageSize * (1 - pageNumber)).Take(pageSize);
            var result = await query.ToListAsync();
            return new PageResultUlt<IEnumerable<Image>>
            {
                Items = result,
                TotalItems = totalCount,
            };
        }

        public async Task<Image> GetImageByIdAsync(int imageId)
        {
            var image = await _context.Images.FirstOrDefaultAsync(x => x.ImageID == imageId);
            return image ?? throw new ArgumentException($"Image with ID {imageId} not found.");
        }

        public async Task<Image> UpdateImageAsync(int id, UpdateImageRequest request)
        {
            var image = await _context.Images.AsNoTracking().FirstOrDefaultAsync(x => x.ImageID == id);
            if (image == null)
                throw new ArgumentException($"Image with ID {id} not found.");
            var existingImage = await _context.Images.FirstOrDefaultAsync(x => x.ImageID != id
            && x.LaboratoryTestReportMedicalHistoryId == request.LaboratoryTestReportMedicalHistoryId
            && x.LaboratoryTestReportLaboratoryTestId == request.LaboratoryTestReportLaboratoryTestId && x.Active == true);
            if (existingImage != null)
                throw new ArgumentException($"An active image already exists for the given laboratory test and medical history with ID {existingImage.ImageID}.");
            if (request.File == null)
                throw new ArgumentException("Image file is required.");
            var existingLaboratoryTest = await _context.LaboratoryTests.FirstOrDefaultAsync(x => x.LaboratoryTestId == request.LaboratoryTestReportLaboratoryTestId);
            if (existingLaboratoryTest == null)
                throw new ArgumentException("Laboratory test not found.");
            var existingMedicalHistory = await _context.MedicalHistories.FirstOrDefaultAsync(x => x.MedicalHistoryId == request.LaboratoryTestReportMedicalHistoryId);
            if (existingMedicalHistory == null)
                throw new ArgumentException("Medical history not found.");
            var item = await _context.LaboratoryTestReports.AsNoTracking().FirstOrDefaultAsync(x => x.MedicalHistoryId == request.LaboratoryTestReportMedicalHistoryId && x.LaboratoryTestId == request.LaboratoryTestReportLaboratoryTestId);
            if (item == null)
            {
                throw new ArgumentException($"Laboratory test report not found with the given medical historyID {request.LaboratoryTestReportMedicalHistoryId} and laboratory test ID: {request.LaboratoryTestReportLaboratoryTestId}.");
            }
            if (id != image.ImageID)
                throw new ArgumentException($"Image ID {id} does not match the ID of the image being updated: {image.ImageID}.");
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var key = $"{request.LaboratoryTestReportLaboratoryTestId}_{request.LaboratoryTestReportMedicalHistoryId}";
                var (filePath, fileName, fileExtension) = await GetImagePath(key, request.File);


                image.FileName = fileName;
                image.FileExtension = fileExtension;
                image.Path = filePath;
                image.LaboratoryTestReportLaboratoryTestId = request.LaboratoryTestReportLaboratoryTestId;
                image.LaboratoryTestReportMedicalHistoryId = request.LaboratoryTestReportMedicalHistoryId;

                _context.Images.Update(image);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return image;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }

        }
        private async Task<(string filePath, string fileName, string fileExtension)> GetImagePath(string key, IFormFile file)
        {
            var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "LaboratoryTestReportImages");
            if (!Directory.Exists(imageFolder)) Directory.CreateDirectory(imageFolder);
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}_{key}_{DateTime.Now:yyyyMMddHHmm}{fileExtension}";
            var filePath = Path.Combine(imageFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return (filePath, fileName, fileExtension);
        }
    }
}