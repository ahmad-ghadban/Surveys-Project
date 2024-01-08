namespace WebAPI.Models
{
    public class Survey
    {
        public int Id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string questions { get; set; }

        public string participants { get; set; }

        public string respondents { get; set; }

        public string deadline { get; set; }

        public bool published { get; set; }

        public bool isPublic { get; set; }
    }
}
