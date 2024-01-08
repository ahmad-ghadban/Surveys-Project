using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Result
    {
        public int Id { get; set; }

        public int userID{ get; set; }

        public int surveyID{ get; set; }

        public string responses { get; set; }
    }
}
