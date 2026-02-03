import SwiftUI

struct HomeView: View {
    private let profile = MockData.profile
    private let documents = MockData.documents
    private let activity = MockData.activity

    @State private var appear = false

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.bgGradient.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        header
                            .opacity(appear ? 1 : 0)
                            .offset(y: appear ? 0 : 12)
                            .animation(.easeOut(duration: 0.6), value: appear)

                        quickActions
                            .opacity(appear ? 1 : 0)
                            .offset(y: appear ? 0 : 12)
                            .animation(.easeOut(duration: 0.6).delay(0.05), value: appear)

                        documentsSection
                        activitySection
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 90)
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                withAnimation(.easeOut(duration: 0.7)) {
                    appear = true
                }
            }
        }
    }

    private var header: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Привіт, \(profile.firstName)")
                    .font(AppFont.title(28))
                    .foregroundColor(.white)

                Text("Твій цифровий гаманець документів")
                    .font(AppFont.body(15))
                    .foregroundColor(.white.opacity(0.75))
            }
            Spacer()
            Circle()
                .fill(Color.white.opacity(0.2))
                .frame(width: 48, height: 48)
                .overlay(
                    Text(profile.initials)
                        .font(AppFont.caption(16))
                        .foregroundColor(.white)
                )
        }
    }

    private var quickActions: some View {
        HStack(spacing: 12) {
            QuickActionButton(title: "Показати QR", icon: "qrcode", tint: AppTheme.accent)
            QuickActionButton(title: "Поділитись", icon: "square.and.arrow.up", tint: AppTheme.ocean)
            QuickActionButton(title: "Оновити", icon: "arrow.clockwise", tint: AppTheme.mint)
        }
    }

    private var documentsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Документи")
                    .font(AppFont.title(20))
                    .foregroundColor(AppTheme.ink)
                Spacer()
                Text("Усі")
                    .font(AppFont.body(14))
                    .foregroundColor(AppTheme.inkSoft)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(Array(documents.enumerated()), id: \\.element.id) { index, document in
                        NavigationLink {
                            DocumentDetailView(document: document)
                        } label: {
                            DocumentCard(document: document)
                        }
                        .buttonStyle(.plain)
                        .opacity(appear ? 1 : 0)
                        .offset(y: appear ? 0 : 12)
                        .animation(.easeOut(duration: 0.6).delay(Double(index) * 0.07), value: appear)
                    }
                }
                .padding(.vertical, 4)
            }
        }
    }

    private var activitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Останні дії")
                .font(AppFont.title(20))
                .foregroundColor(AppTheme.ink)

            VStack(spacing: 10) {
                ForEach(Array(activity.enumerated()), id: \\.element.id) { index, item in
                    ActivityRow(item: item)
                        .opacity(appear ? 1 : 0)
                        .offset(y: appear ? 0 : 10)
                        .animation(.easeOut(duration: 0.5).delay(0.15 + Double(index) * 0.06), value: appear)
                }
            }
        }
    }
}

#Preview {
    HomeView()
}


