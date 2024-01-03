using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ISurveyRepository
    {
        Task<IEnumerable<Survey>> GetSurveysAsync();
        Task<Survey> FindID(int id);
        void addSurvey(AddSurveyDto addSurveyDto);
        Task<bool> SurveyAlreadyExists(string name);
        Task<Survey> Find(string name);
        Task<bool> SurveyDoesNotExist(int id);
        void deleteSurvey(Survey survey);
    }
}
