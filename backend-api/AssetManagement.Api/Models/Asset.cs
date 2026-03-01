using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Api.Models
{
    [Table("Asset")]
    public class Asset
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        [Column("Name")]
        public string Name { get; set; } = string.Empty;
        [Column("Category")]
        public string Category { get; set; } = string.Empty;
        [Column("PurchaseDate")]
        public DateTime PurchaseDate { get; set; }
        [Column("Status")]
        public string Status { get; set; } = "Active";
        [Column("Price")]
        public double Price { get; set; } = 0.0;
    }
}