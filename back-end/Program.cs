
using back_end.Repositories;
using back_end.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

/* Repository */

builder.Services.AddScoped<
    IActivityRepository,
    ActivityRepository
>();

/* Service */

builder.Services.AddScoped<
    IActivityService,
    ActivityService
>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

/* app.UseHttpsRedirection(); */

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();