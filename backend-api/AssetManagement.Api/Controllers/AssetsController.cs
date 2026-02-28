using Microsoft.AspNetCore.Mvc;
using AssetManagement.Api.Data;
using AssetManagement.Api.Models;
using OfficeOpenXml;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid file.");

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];

            int rowCount = worksheet.Dimension.Rows;

            for (int row = 2; row <= rowCount; row++)
            {
                var asset = new Asset
                {
                    Name = worksheet.Cells[row, 2].Text,
                    Category = worksheet.Cells[row, 3].Text,
                    PurchaseDate = DateTime.Parse(worksheet.Cells[row, 4].Text),
                    Status = worksheet.Cells[row, 5].Text,
                    Price = double.Parse(worksheet.Cells[row, 6].Text)
                };

                _context.Assets.Add(asset);
            }

            await _context.SaveChangesAsync();

            return Ok("Data inserted successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var assets = await _context.Assets.ToListAsync();
            return Ok(assets);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            string? name,
            string? category,
            DateTime? startDate,
            DateTime? endDate)
        {
            var query = _context.Assets.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(a => a.Name.Contains(name));

            if (!string.IsNullOrEmpty(category))
                query = query.Where(a => a.Category == category);

            if (startDate.HasValue)
                query = query.Where(a => a.PurchaseDate >= startDate);

            if (endDate.HasValue)
                query = query.Where(a => a.PurchaseDate <= endDate);

            return Ok(await query.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return Ok(asset);
        }

       [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Asset asset)
        {
            var existing = await _context.Assets.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = asset.Name;
            existing.Category = asset.Category;
            existing.PurchaseDate = asset.PurchaseDate;
            existing.Status = asset.Status;
            existing.Price = asset.Price;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return NotFound();

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpGet("forecast")]
        public async Task<IActionResult> Forecast()
        {
            using var client = new HttpClient();
            var response = await client.GetAsync("http://ml-service:8000/forecast");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();

            return Content(content, "application/json");
        }
    }
    
}