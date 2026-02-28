using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Api.Models;

namespace AssetManagement.Api.Repositories
{
    public interface IAssetRepository
    {   
        Task<IEnumerable<Asset>> GetAllAsync();
        Task<Asset?> GetByIdAsync(int id);
        Task<Asset> AddAsync(Asset asset);
    }
}