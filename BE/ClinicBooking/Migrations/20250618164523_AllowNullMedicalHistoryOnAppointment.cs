using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBooking.Migrations
{
    /// <inheritdoc />
    public partial class AllowNullMedicalHistoryOnAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalHistories_MedicalHistoryId",
                table: "Appointments");

            migrationBuilder.AlterColumn<int>(
                name: "MedicalHistoryId",
                table: "Appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalHistories_MedicalHistoryId",
                table: "Appointments",
                column: "MedicalHistoryId",
                principalTable: "MedicalHistories",
                principalColumn: "MedicalHistoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalHistories_MedicalHistoryId",
                table: "Appointments");

            migrationBuilder.AlterColumn<int>(
                name: "MedicalHistoryId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalHistories_MedicalHistoryId",
                table: "Appointments",
                column: "MedicalHistoryId",
                principalTable: "MedicalHistories",
                principalColumn: "MedicalHistoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
