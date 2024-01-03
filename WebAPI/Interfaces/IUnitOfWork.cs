namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {

        IUserRepository UserRepository { get; }
        IResultsRepo ResultsRepo { get; }

        ISurveyRepository SurveyRepository { get; }
        Task<bool> SaveAsync();
    }
}
