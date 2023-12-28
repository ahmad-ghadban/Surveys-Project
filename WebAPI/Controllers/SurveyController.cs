using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    public class SurveyController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;

        public SurveyController(IUnitOfWork uow, IConfiguration configuration)
        {
            this.uow = uow;
            this.configuration = configuration;
        }

        // api/survey
        //[Authorize(Roles = "Admin")]
        [HttpGet("")]
        public async Task<IActionResult> GetSurveys()
        {
            var surveys = await uow.SurveyRepository.GetSurveysAsync();
            return Ok(surveys);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> FindSurvey(int id)
        {
            var survey = await uow.SurveyRepository.FindID(id);
            return Ok(survey);
        }
        [HttpGet("respondants/{id}")]
        public async Task<IActionResult> GetSurveyRespondants(int id)
        {
            var survey = await uow.SurveyRepository.FindID(id);
            return Ok(survey.respondents);
        }

        [HttpGet("id/{name}")]
        public async Task<IActionResult> FindSurveyID(string name)
        {
            var survey = await uow.SurveyRepository.Find(name);
            return Ok(survey.Id);
        }

        [HttpPost("add")]
        public async Task<IActionResult> addSurvey(AddSurveyDto addSurveyDto)
        {
            if (await uow.SurveyRepository.SurveyAlreadyExists(addSurveyDto.name))
            {
                return BadRequest("Survey name already exists!");
            }
            uow.SurveyRepository.addSurvey(addSurveyDto);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteSurvey(int id)
        {
            if (await uow.SurveyRepository.SurveyDoesNotExist(id))
            {
                return BadRequest("Attempting to Delete a survey that doesn't exist");
            }
            var survey = await uow.SurveyRepository.FindID(id);
            uow.SurveyRepository.deleteSurvey(survey);
            await uow.SaveAsync();
            return StatusCode(201);
        }



        [HttpPut("editRespondents/{id}")]
        public async Task<IActionResult> EditCompleted(int id, string respondents)
        {
            var survey = await uow.SurveyRepository.FindID(id);
            survey.respondents = respondents;
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet("participants/{id}")]
        public async Task<IActionResult> GetSurveyParticipants(int id)
        {
            var survey = await uow.SurveyRepository.FindID(id);
            return Ok(survey.participants);
        }

        [HttpPut("publish/{id}")]
        public async Task<IActionResult> PublishSurvey(int id)
        {
            var survey = await uow.SurveyRepository.FindID(id);
            survey.published = true;
            await uow.SaveAsync();
            return StatusCode(201);
        }

    }
}
