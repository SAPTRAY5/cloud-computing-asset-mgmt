using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Api.Models;
using AssetManagement.Api.Repositories;

namespace AssetManagement.Api.Services
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;

        public AssetService(IAssetRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Asset>> GetAssetsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Asset?> GetAssetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Asset> CreateAssetAsync(Asset asset)
        {
            return await _repository.AddAsync(asset);
        }
    }
}