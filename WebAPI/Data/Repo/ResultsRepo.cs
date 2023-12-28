using Microsoft.EntityFrameworkCore;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class ResultsRepo : IResultsRepo
    {
        private readonly DataContext dc;

        public ResultsRepo(DataContext dc)
        {
            this.dc = dc;
        }

        public void addResult(AddResultDto addResultDto)
        {
            Result result = new Result();
            result.userID = addResultDto.userId;
            result.surveyID = addResultDto.surveyId;
            result.responses = addResultDto.responses;

            dc.Results.Add(result);
        }

        public async Task<IEnumerable<Result>> GetResultsAsync(int id)
        {
            return await dc.Results.Where(x => x.surveyID == id).ToListAsync();

        }

    }
}
