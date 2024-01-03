using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IResultsRepo
    {

        Task<IEnumerable<Result>> GetResultsAsync(int id);
        void addResult(AddResultDto addResultDto);
    }
}
