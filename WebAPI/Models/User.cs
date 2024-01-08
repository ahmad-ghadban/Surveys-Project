using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Password { get; set; }


        public string Completed { get; set; }
        public string Access { get; set; }
        public string Active { get; set; }
    }
}
