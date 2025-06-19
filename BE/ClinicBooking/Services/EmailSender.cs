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
            var subject = "Xác nhận tài khoản";
            var message = $"Vui lòng xác nhận tài khoản bằng cách nhấn vào liên kết sau: <a href='{confirmationLink}'>Xác nhận</a>";
            await SendEmailAsync(user, email, subject, message);
        }

        public async Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
        {
            var subject = "Đặt lại mật khẩu";
            var message = $"Bạn có thể đặt lại mật khẩu bằng cách nhấn vào liên kết sau: <a href='{resetLink}'>Đặt lại mật khẩu</a>";
            await SendEmailAsync(user, email, subject, message);
        }
        private async Task SendEmailAsync(TUser user, string toEmail, string subject, string body)
        {
            //string firstName = (user as User)?.FirstName ?? "bạn";
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Connectify", _settings.UserName));
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
            var subject = "Mã đặt lại mật khẩu";
            var message = $@"
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Mã đặt lại mật khẩu của bạn là: <strong>{resetCode}</strong></p>
        <p>Vui lòng nhập mã này trong ứng dụng để tiếp tục quá trình.</p>";

            await SendEmailAsync(user, email, subject, message);
        }

    }
}
