using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Api.Models;

namespace AssetManagement.Api.Services
{
   public interface IAssetService
    {
    Task<IEnumerable<Asset>> GetAssetsAsync();
    Task<Asset?> GetAssetByIdAsync(int id);
    Task<Asset> CreateAssetAsync(Asset asset);
    }   
}