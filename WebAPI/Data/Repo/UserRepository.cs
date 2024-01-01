using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Data;
using System.Security.Cryptography;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<User> Authenticate(string name, string password)
        {
            return await dc.Users.FirstOrDefaultAsync(x => x.Name == name && x.Password == password);
        }

        public async Task<User> Find(string name)
        {
            return await dc.Users.FirstOrDefaultAsync(x => x.Name == name);

        }
        public async Task<User> FindID(int id)
        {
            return await dc.Users.FirstOrDefaultAsync(x => x.Id == id);

        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await dc.Users.ToListAsync();
        }

        public void Register(string name, string password)
        {
            User user = new User();
            user.Name = name;
            user.Password = password;
            user.Access = "\"\"";
            user.Completed = "\"\"";
            user.Active = "1";

            dc.Users.Add(user);
        }

        public async Task<bool> UserAlreadyExists(string name)
        {
            return await dc.Users.AnyAsync(x => x.Name == name);
        }
    }
}
