using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User> Authenticate(string name, string password);

        Task<IEnumerable<User>> GetUsersAsync();

        void Register(string name, string password);

        Task<bool> UserAlreadyExists(string name);

        Task<User> Find(string name);

        Task<User> FindID(int id);
    }
}
