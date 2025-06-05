using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.Controllers;

public class UploadController : BaseApiController
{
    private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Không có file nào được chọn.");

        // Tạo tên file duy nhất với GUID
        string fileName = string.Format("{0}-{1}", Guid.NewGuid().ToString(), file.FileName);

        // Chuyển tên file thành không dấu
        string fileNameWithoutDiacritics = RemoveDiacritics(fileName);

        var filePath = Path.Combine(_uploadFolder, fileNameWithoutDiacritics);

        // Lưu file vào thư mục Upload
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Tạo URL đầy đủ (bao gồm tên miền và cổng)
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var fileUrl = $"{baseUrl}/uploads/{fileNameWithoutDiacritics}";

        // Trả về URL đầy đủ và thêm header Location
        return Created(fileUrl, new { FileUrl = fileUrl });
    }

    public static string RemoveDiacritics(string text)
    {
        // Chuyển văn bản thành không dấu
        text = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in text)
        {
            // Lọc bỏ các ký tự có dấu (được phân tách ra thành ký tự cơ bản và dấu)
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }

    [HttpGet("list-files")]
    public IActionResult GetUploadedFiles()
    {
        // Lấy tất cả các tên file trong thư mục Upload
        var files = Directory.GetFiles(_uploadFolder)
                             .Select(f => Path.GetFileName(f)) // Lấy tên file
                             .ToList();

        return Ok(files);
    }
}
