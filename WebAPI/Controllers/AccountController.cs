using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;

        public AccountController(IUnitOfWork uow, IConfiguration configuration)
        {
            this.uow = uow;
            this.configuration = configuration;
        }

        // api/account
        //[Authorize(Roles = "Admin")]
        [HttpGet("")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await uow.UserRepository.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetUser(string name)
        {
            var user = await uow.UserRepository.Find(name);
            return Ok(user.Id);
        }

        [HttpGet("access/{name}")]
        public async Task<IActionResult> GetUserAccess(string name)
        {
            var user = await uow.UserRepository.Find(name);
            return Ok(user.Access);
        }

        [HttpGet("completed/{name}")]
        public async Task<IActionResult> GetUserCompleted(string name)
        {
            var user = await uow.UserRepository.Find(name);
            return Ok(user.Completed);
        }

        // api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginReqDto loginReq)
        {
            var user = await uow.UserRepository.Authenticate(loginReq.Name, loginReq.Password);
            if (user == null || user.Active == "0")
            {
                return Unauthorized("Invalid credentials");
            }

            var loginRes = new LoginResDto();
            loginRes.name = user.Name;
            loginRes.Token = CreateJWT(user);
            return Ok(loginRes);

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginReqDto loginReq)
        {
            if (await uow.UserRepository.UserAlreadyExists(loginReq.Name))
            {
                return BadRequest("User already exists!");
            }
            uow.UserRepository.Register(loginReq.Name, loginReq.Password);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("deactivate/{name}")]
        public async Task<IActionResult> Deactivate(string name)
        {
            var user = await uow.UserRepository.Find(name);
            user.Active = "0";
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("activate/{name}")]
        public async Task<IActionResult> activate(string name)
        {
            var user = await uow.UserRepository.Find(name);
            user.Active = "1";
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("editName/{id}")]
        public async Task<IActionResult> EditName(int id, string name)
        {
            if (await uow.UserRepository.UserAlreadyExists(name))
            {
                return BadRequest("User already exists!");
            }
            var user = await uow.UserRepository.FindID(id);
            user.Name= name;
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("editPassword/{id}")]
        public async Task<IActionResult> EditPassword(int id, string password)
        {
            var user = await uow.UserRepository.FindID(id);
            user.Password = password;
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("editAccess/{name}")]
        public async Task<IActionResult> EditAccess(string name, string access)
        {
            var user = await uow.UserRepository.Find(name);
            user.Access = access;
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("editCompleted/{name}")]
        public async Task<IActionResult> EditCompleted(string name, string completed)
        {
            var user = await uow.UserRepository.Find(name);
            user.Completed = completed;
            await uow.SaveAsync();
            return StatusCode(201);
        }


        private string CreateJWT(User user)
        {
            var secretKey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                // new Claim(ClaimTypes.Role, user.Name.ToString() != "Administrator" ? "Admin" : "Admin")
            };

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);

        }

    }
}
