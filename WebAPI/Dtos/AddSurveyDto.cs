namespace WebAPI.Dtos
{
    public class AddSurveyDto
    {
        public string name { get; set; }

        public string description { get; set; }

        public string questions { get; set; }

        public string participants { get; set; }

        public string deadline { get; set; }

        public bool published { get; set; }

        public bool isPublic { get; set; }
    }
}
