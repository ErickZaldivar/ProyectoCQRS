namespace DocumentosAPI.Integration.Tests.Fixtures;

using DocumentosAPI.Infrastructure.BD.Context;
using Microsoft.EntityFrameworkCore;

public class AppDbContextTest : AppDbContext
{
    public AppDbContextTest(DbContextOptions<AppDbContext> options) 
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
            entity.SetSchema(null);
    }
}