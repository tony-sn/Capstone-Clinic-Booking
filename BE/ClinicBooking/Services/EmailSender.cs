using ClinicBooking.Models;
using ClinicBooking.Models.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;

namespace ClinicBooking.Services
{
    public class EmailSender<TUser> : IEmailSender<TUser> where TUser : class
    {
        private readonly EmailSenderSettings _settings;

        public EmailSender(IOptions<EmailSenderSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink)
        {
            var subject = "Confirm Your Account";
            var message = $@"
    <div style='font-family:Segoe UI, sans-serif; font-size:14px; color:#333;'>
        <h2 style='color:#2d8cf0;'>Welcome to ClinicBooking!</h2>
        <p>Hi {(user as User)?.FirstName ?? "there"},</p>
        <p>Thank you for registering. Please confirm your email by clicking the button below:</p>
        <p style='text-align:center; margin:20px 0;'>
            <a href='{confirmationLink}' style='background-color:#2d8cf0;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;'>Confirm Email</a>
        </p>
        <p>If you didn't create this account, you can ignore this email.</p>
        <p>Best regards,<br>ClinicBooking Team</p>
    </div>";

            await SendEmailAsync(user, email, subject, message);
        }

        public async Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
        {
            var subject = "Reset Your Password";
            var message = $@"
    <div style='font-family:Segoe UI, sans-serif; font-size:14px; color:#333;'>
        <h2 style='color:#f56c6c;'>Reset Password Request</h2>
        <p>Hi {(user as User)?.FirstName ?? "there"},</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p style='text-align:center; margin:20px 0;'>
            <a href='{resetLink}' style='background-color:#f56c6c;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;'>Reset Password</a>
        </p>
        <p>If you didn't request a password reset, no action is needed.</p>
        <p>Best regards,<br>ClinicBooking Team</p>
    </div>";

            await SendEmailAsync(user, email, subject, message);
        }
        private async Task SendEmailAsync(TUser user, string toEmail, string subject, string body)
        {
            //string firstName = (user as User)?.FirstName ?? "bạn";
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("ClinicBooking", _settings.From));
            email.To.Add(new MailboxAddress((user as User)?.FirstName ?? "bạn", toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.UserName, _settings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
        {
            var subject = "Your Password Reset Code";
            var message = $@"
    <div style='font-family:Segoe UI, sans-serif; font-size:14px; color:#333;'>
        <h2 style='color:#f39c12;'>Password Reset Code</h2>
        <p>Hi {(user as User)?.FirstName ?? "there"},</p>
        <p>You requested to reset your password. Use the following code in the app to continue:</p>
        <p style='font-size:20px; font-weight:bold; color:#f39c12; text-align:center; margin:20px 0;'>{resetCode}</p>
        <p>This code will expire soon. If you did not request this, please ignore this message.</p>
        <p>Best regards,<br>ClinicBooking Team</p>
    </div>";

            await SendEmailAsync(user, email, subject, message);
        }
    }
}
