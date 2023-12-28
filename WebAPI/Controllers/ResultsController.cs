using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    public class ResultsController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;

        public ResultsController(IUnitOfWork uow, IConfiguration configuration)
        {
            this.uow = uow;
            this.configuration = configuration;
        }

        // api/results
        //[Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetResults(int id)
        {
            var result = await uow.ResultsRepo.GetResultsAsync(id);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> addResult (AddResultDto addResultDto)
        {
            uow.ResultsRepo.addResult(addResultDto);
            await uow.SaveAsync();
            return StatusCode(201);
        }
    }
}
