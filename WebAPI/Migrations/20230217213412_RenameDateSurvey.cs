using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class RenameDateSurvey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deadline",
                table: "Surveys");

            migrationBuilder.AddColumn<int>(
                name: "deadline",
                table: "Surveys",
                type: "int",
                nullable: false,
                defaultValue: 4832283600);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deadline",
                table: "Surveys");
        }
    }
}
