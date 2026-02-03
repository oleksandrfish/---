import SwiftUI

struct ProfileView: View {
    private let profile = MockData.profile

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.bgGradient.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        profileCard

                        Text("Налаштування")
                            .font(AppFont.title(20))
                            .foregroundColor(AppTheme.ink)

                        VStack(spacing: 12) {
                            SettingsRow(title: "Особисті дані", subtitle: "Контакти та адреса", icon: "person.text.rectangle", tint: AppTheme.ocean)
                            SettingsRow(title: "Безпека", subtitle: "PIN, Face ID", icon: "lock.fill", tint: AppTheme.mint)
                            SettingsRow(title: "Сповіщення", subtitle: "Канали та частота", icon: "bell.fill", tint: AppTheme.amber)
                            SettingsRow(title: "Допомога", subtitle: "Підтримка", icon: "questionmark.circle", tint: AppTheme.slate)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 90)
                }
            }
            .navigationBarHidden(true)
        }
    }

    private var profileCard: some View {
        HStack(spacing: 16) {
            Circle()
                .fill(AppTheme.ocean.opacity(0.2))
                .frame(width: 60, height: 60)
                .overlay(
                    Text(profile.initials)
                        .font(AppFont.title(18))
                        .foregroundColor(AppTheme.ocean)
                )

            VStack(alignment: .leading, spacing: 6) {
                Text(profile.fullName)
                    .font(AppFont.title(20))
                    .foregroundColor(AppTheme.ink)
                Text(profile.phone)
                    .font(AppFont.body(13))
                    .foregroundColor(AppTheme.inkSoft)
                Text(profile.email)
                    .font(AppFont.body(13))
                    .foregroundColor(AppTheme.inkSoft)
            }

            Spacer()
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.92))
                .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 6)
        )
    }
}

#Preview {
    ProfileView()
}

