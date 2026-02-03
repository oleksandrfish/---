import SwiftUI

struct MockData {
    static let profile = UserProfile(
        fullName: "Софія Коваль",
        phone: "+38 099 321 45 67",
        email: "sofia.koval@example.com",
        idNumber: "EK 238741",
        address: "м. Київ, вул. Січових Стрільців, 18",
        initials: "СК"
    )

    static let documents: [Document] = [
        Document(title: "ID картка", subtitle: "Громадянство України", number: "№ 0042 881199", issued: "12.04.2021", expires: "12.04.2031", status: "Дійсний", icon: "person.text.rectangle", tint: AppTheme.ocean),
        Document(title: "Водійське посвідчення", subtitle: "Категорії B, C", number: "№ 74 202 661", issued: "03.08.2019", expires: "03.08.2029", status: "Дійсний", icon: "car.fill", tint: AppTheme.mint),
        Document(title: "Студентський", subtitle: "КНУ ім. Т. Шевченка", number: "№ ST 218 039", issued: "01.09.2023", expires: "30.06.2027", status: "Активний", icon: "graduationcap.fill", tint: AppTheme.amber)
    ]

    static let services: [Service] = [
        Service(title: "Довідки", subtitle: "Витяги та статуси", icon: "doc.text.magnifyingglass", tint: AppTheme.ocean),
        Service(title: "Штрафи", subtitle: "Перевірка та оплата", icon: "exclamationmark.triangle.fill", tint: AppTheme.amber),
        Service(title: "Медицина", subtitle: "Записи та карти", icon: "heart.text.square.fill", tint: AppTheme.mint),
        Service(title: "Підтвердження", subtitle: "QR та шеринґ", icon: "qrcode", tint: AppTheme.accent),
        Service(title: "Податки", subtitle: "Статус ФОП", icon: "banknote.fill", tint: AppTheme.slate),
        Service(title: "Транспорт", subtitle: "Реєстрація авто", icon: "car.2.fill", tint: AppTheme.ocean)
    ]

    static let activity: [ActivityItem] = [
        ActivityItem(title: "Документ оновлено", subtitle: "ID картка", time: "сьогодні 09:12", icon: "arrow.clockwise", tint: AppTheme.ocean),
        ActivityItem(title: "Сервіс виконано", subtitle: "Довідка про доходи", time: "вчора 18:40", icon: "checkmark.seal.fill", tint: AppTheme.mint),
        ActivityItem(title: "Запит створено", subtitle: "Підтвердження документів", time: "28.01", icon: "paperplane.fill", tint: AppTheme.amber)
    ]
}

