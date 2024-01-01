using Microsoft.EntityFrameworkCore;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class SurveyRepository : ISurveyRepository
    {
        private readonly DataContext dc;

        public SurveyRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<IEnumerable<Survey>> GetSurveysAsync()
        {
            return await dc.Surveys.ToListAsync();
        }

        public async Task<Survey> FindID(int id)
        {
            return await dc.Surveys.FirstOrDefaultAsync(x => x.Id == id);

        }

        public void addSurvey(AddSurveyDto addSurveyDto)
        {
            Survey survey = new Survey();
            survey.name = addSurveyDto.name;
            survey.description = addSurveyDto.description;
            survey.questions = addSurveyDto.questions;
            survey.participants = addSurveyDto.participants;
            survey.deadline = addSurveyDto.deadline;
            survey.published = addSurveyDto.published;
            survey.isPublic = addSurveyDto.isPublic;
            survey.respondents = "\"\"";

            dc.Surveys.Add(survey);
        }

        public async Task<bool> SurveyAlreadyExists(string name)
        {
            return await dc.Surveys.AnyAsync(x => x.name == name);
        }

        public async Task<bool> SurveyDoesNotExist(int id)
        {
            return !(await dc.Surveys.AnyAsync(x => x.Id == id));
        }

        public void deleteSurvey(Survey surveyToRemove)
        {
            dc.Surveys.Remove(surveyToRemove);
        }

        public async Task<Survey> Find(string name)
        {
            return await dc.Surveys.FirstOrDefaultAsync(x => x.name == name);

        }
    }
}
