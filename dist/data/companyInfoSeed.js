"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyInfoSeedData = void 0;
const mongoose_1 = require("mongoose");
exports.companyInfoSeedData = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'general',
        title: 'MinhLoc Group - Tập đoàn đa ngành hàng đầu Việt Nam',
        content: 'MinhLoc Group là tập đoàn đa ngành với hơn 15 năm kinh nghiệm trong các lĩnh vực bất động sản, đầu tư tài chính và kinh doanh nhân sâm cao cấp. Với slogan "Xây dựng tương lai, phát triển bền vững", chúng tôi cam kết mang đến những giá trị tốt nhất cho khách hàng và cộng đồng.',
        images: [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43.jpg',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab.jpg'
        ],
        data: {
            companyName: 'MinhLoc Group',
            foundedYear: 2008,
            headquarters: 'Hà Nội, Việt Nam',
            contactInfo: {
                email: 'info@minhlocgroup.com',
                phone: '(+84) 24 1234 5678',
                address: '123 Láng Hạ, Đống Đa, Hà Nội',
                website: 'https://minhlocgroup.com'
            },
            socialMedia: {
                facebook: 'https://facebook.com/minhlocgroup',
                linkedin: 'https://linkedin.com/company/minhlocgroup',
                youtube: 'https://youtube.com/minhlocgroup'
            },
            mission: 'Mang đến những sản phẩm và dịch vụ chất lượng cao, góp phần xây dựng cuộc sống tốt đẹp hơn cho cộng đồng và phát triển bền vững.',
            vision: 'Trở thành tập đoàn đa ngành hàng đầu Việt Nam và khu vực Đông Nam Á, được khách hàng tin tưởng và đối tác đánh giá cao.',
            values: [
                'Chất lượng - Cam kết mang đến sản phẩm và dịch vụ tốt nhất',
                'Uy tín - Xây dựng mối quan hệ lâu dài với khách hàng và đối tác',
                'Sáng tạo - Không ngừng đổi mới và phát triển',
                'Phát triển bền vững - Đóng góp tích cực cho cộng đồng và môi trường'
            ],
            achievements: [
                {
                    number: '100+',
                    label: 'Doanh nghiệp lớn nhất Việt Nam'
                },
                {
                    number: '2023',
                    label: 'Giải thưởng Doanh nghiệp Xanh'
                },
                {
                    number: 'ISO',
                    label: 'Chứng nhận ISO 9001:2015'
                },
                {
                    number: '1000+',
                    label: 'Dự án đã hoàn thành'
                },
                {
                    number: '50,000+',
                    label: 'Khách hàng phục vụ'
                },
                {
                    number: '5',
                    label: 'Năm liên tiếp "Doanh nghiệp uy tín"'
                }
            ]
        },
        isActive: true,
        sortOrder: 1,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'history',
        title: 'Lịch sử hình thành và phát triển',
        content: 'MinhLoc Group được thành lập năm 2008 với tầm nhìn trở thành tập đoàn đa ngành hàng đầu Việt Nam. Từ những ngày đầu khởi nghiệp với đội ngũ nhỏ, chúng tôi đã không ngừng phát triển và mở rộng hoạt động kinh doanh.',
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d.jpg',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71.jpg'
        ],
        data: {
            milestones: [
                {
                    year: '2008',
                    event: 'Thành lập MinhLoc Group',
                    description: 'Khởi đầu với lĩnh vực bất động sản tại Hà Nội'
                },
                {
                    year: '2012',
                    event: 'Mở rộng sang lĩnh vực đầu tư tài chính',
                    description: 'Thành lập công ty con chuyên về đầu tư và tư vấn tài chính'
                },
                {
                    year: '2015',
                    event: 'Ra mắt thương hiệu nhân sâm cao cấp',
                    description: 'Bắt đầu kinh doanh nhân sâm Hàn Quốc và các sản phẩm chăm sóc sức khỏe'
                },
                {
                    year: '2018',
                    event: 'Mở rộng ra thị trường miền Nam',
                    description: 'Thành lập chi nhánh tại TP. Hồ Chí Minh và các tỉnh lân cận'
                },
                {
                    year: '2020',
                    event: 'Chuyển đổi số và phát triển công nghệ',
                    description: 'Ứng dụng công nghệ 4.0 vào quản lý và kinh doanh'
                },
                {
                    year: '2023',
                    event: 'Đạt mốc 15 năm thành lập',
                    description: 'Trở thành một trong những tập đoàn uy tín nhất Việt Nam'
                }
            ]
        },
        isActive: true,
        sortOrder: 2,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'competitiveness',
        title: 'Năng lực cạnh tranh và thế mạnh',
        content: 'Với hơn 15 năm kinh nghiệm và đội ngũ chuyên nghiệp, MinhLoc Group tự hào sở hữu những thế mạnh vượt trội trong các lĩnh vực hoạt động.',
        images: [
            'https://images.unsplash.com/photo-1559136555-9303baea8ebd.jpg',
            'https://images.unsplash.com/photo-1552664730-d307ca884978.jpg'
        ],
        data: {
            strengths: [
                {
                    title: 'Kinh nghiệm dày dặn',
                    description: 'Hơn 15 năm hoạt động trong thị trường Việt Nam với hơn 1000 dự án thành công',
                    icon: 'Business',
                    color: '#1976d2'
                },
                {
                    title: 'Đội ngũ chuyên nghiệp',
                    description: 'Hơn 500 nhân viên được đào tạo chuyên sâu, có chứng chỉ quốc tế',
                    icon: 'People',
                    color: '#2e7d32'
                },
                {
                    title: 'Công nghệ hiện đại',
                    description: 'Ứng dụng công nghệ 4.0, AI và Big Data vào quản lý và kinh doanh',
                    icon: 'Technology',
                    color: '#f57c00'
                },
                {
                    title: 'Mạng lưới đối tác rộng',
                    description: 'Hợp tác với hơn 200 đối tác trong và ngoài nước',
                    icon: 'Network',
                    color: '#7b1fa2'
                },
                {
                    title: 'Chất lượng sản phẩm',
                    description: 'Cam kết chất lượng cao với chứng nhận ISO 9001:2015',
                    icon: 'Quality',
                    color: '#d32f2f'
                },
                {
                    title: 'Dịch vụ khách hàng',
                    description: 'Hỗ trợ khách hàng 24/7 với đội ngũ chăm sóc khách hàng chuyên nghiệp',
                    icon: 'Service',
                    color: '#388e3c'
                }
            ]
        },
        isActive: true,
        sortOrder: 3,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'system',
        title: 'Hệ thống MinhLoc Group',
        content: 'MinhLoc Group hoạt động với hệ thống quản lý hiện đại, bao gồm nhiều lĩnh vực kinh doanh và mạng lưới chi nhánh rộng khắp cả nước.',
        images: [
            'https://images.unsplash.com/photo-1551434678-e076c223a692.jpg',
            'https://images.unsplash.com/photo-1552664730-d307ca884978.jpg'
        ],
        data: {
            businessAreas: [
                {
                    name: 'Bất động sản',
                    description: 'Phát triển dự án nhà ở, thương mại và công nghiệp',
                    items: [
                        'Dự án nhà ở cao cấp',
                        'Khu đô thị thông minh',
                        'Trung tâm thương mại',
                        'Khu công nghiệp'
                    ],
                    color: '#1976d2'
                },
                {
                    name: 'Đầu tư tài chính',
                    description: 'Dịch vụ tư vấn đầu tư và quản lý tài sản',
                    items: [
                        'Tư vấn đầu tư bất động sản',
                        'Quản lý quỹ đầu tư',
                        'Dịch vụ ngân hàng tư nhân',
                        'Bảo hiểm và an ninh tài chính'
                    ],
                    color: '#2e7d32'
                },
                {
                    name: 'Nhân sâm và chăm sóc sức khỏe',
                    description: 'Kinh doanh nhân sâm cao cấp và sản phẩm chăm sóc sức khỏe',
                    items: [
                        'Nhân sâm Hàn Quốc cao cấp',
                        'Thực phẩm chức năng',
                        'Spa và chăm sóc sức khỏe',
                        'Tư vấn dinh dưỡng'
                    ],
                    color: '#f57c00'
                }
            ],
            network: [
                {
                    city: 'Hà Nội',
                    projects: 450,
                    staff: 200
                },
                {
                    city: 'TP. Hồ Chí Minh',
                    projects: 380,
                    staff: 180
                },
                {
                    city: 'Đà Nẵng',
                    projects: 120,
                    staff: 80
                },
                {
                    city: 'Hải Phòng',
                    projects: 90,
                    staff: 60
                },
                {
                    city: 'Cần Thơ',
                    projects: 70,
                    staff: 40
                }
            ]
        },
        isActive: true,
        sortOrder: 4,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'partners',
        title: 'Đối tác chiến lược',
        content: 'MinhLoc Group tự hào được hợp tác với nhiều đối tác uy tín trong và ngoài nước, tạo nên mạng lưới mạnh mẽ và đáng tin cậy.',
        images: [
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902.jpg',
            'https://images.unsplash.com/photo-1552664730-d307ca884978.jpg'
        ],
        data: {
            partners: [
                {
                    name: 'Samsung C&T Corporation',
                    type: 'Đối tác xây dựng',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'Posco Engineering & Construction',
                    type: 'Đối tác kỹ thuật',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'Korea Ginseng Corporation',
                    type: 'Đối tác nhân sâm',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'Vietcombank',
                    type: 'Đối tác tài chính',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'BIDV',
                    type: 'Đối tác ngân hàng',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'VinGroup',
                    type: 'Đối tác bất động sản',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'FLC Group',
                    type: 'Đối tác phát triển',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                },
                {
                    name: 'Novaland',
                    type: 'Đối tác dự án',
                    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71.jpg'
                }
            ]
        },
        isActive: true,
        sortOrder: 5,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        section: 'social_activities',
        title: 'Hoạt động xã hội và trách nhiệm cộng đồng',
        content: 'MinhLoc Group luôn cam kết đóng góp tích cực cho cộng đồng thông qua các hoạt động xã hội và chương trình trách nhiệm xã hội.',
        images: [
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a.jpg',
            'https://images.unsplash.com/photo-1552664730-d307ca884978.jpg'
        ],
        data: {
            activities: [
                {
                    title: 'Chương trình "Nhà ở cho người nghèo"',
                    description: 'Xây dựng và trao tặng 100 căn nhà cho các hộ gia đình có hoàn cảnh khó khăn tại các tỉnh miền núi phía Bắc. Chương trình được thực hiện hàng năm với tổng giá trị hơn 5 tỷ đồng.',
                    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa.jpg'
                },
                {
                    title: 'Học bổng "Ước mơ xanh"',
                    description: 'Cấp học bổng cho 500 học sinh, sinh viên có hoàn cảnh khó khăn nhưng học tập tốt. Mỗi suất học bổng trị giá 10 triệu đồng/năm.',
                    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1.jpg'
                },
                {
                    title: 'Chương trình "Xanh hóa môi trường"',
                    description: 'Trồng 10,000 cây xanh tại các khu vực đô thị và hỗ trợ các dự án bảo vệ môi trường. Đã trồng được hơn 50,000 cây xanh trong 3 năm qua.',
                    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e.jpg'
                },
                {
                    title: 'Hỗ trợ y tế cộng đồng',
                    description: 'Tài trợ trang thiết bị y tế cho các bệnh viện tuyến huyện và tổ chức khám bệnh miễn phí cho người dân. Đã khám và điều trị cho hơn 5,000 bệnh nhân.',
                    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f.jpg'
                },
                {
                    title: 'Phát triển thể thao cộng đồng',
                    description: 'Xây dựng sân thể thao và tổ chức các giải đấu thể thao cho thanh thiếu niên. Đã xây dựng 20 sân thể thao tại các khu vực nông thôn.',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b.jpg'
                }
            ],
            achievements: [
                {
                    number: '100+',
                    label: 'Dự án xã hội'
                },
                {
                    number: '50,000+',
                    label: 'Người được hỗ trợ'
                },
                {
                    number: '500+',
                    label: 'Học bổng trao tặng'
                },
                {
                    number: '10,000+',
                    label: 'Cây xanh trồng'
                },
                {
                    number: '5,000+',
                    label: 'Bệnh nhân được khám'
                },
                {
                    number: '20+',
                    label: 'Sân thể thao xây dựng'
                }
            ]
        },
        isActive: true,
        sortOrder: 6,
        createdBy: new mongoose_1.Types.ObjectId(),
        updatedBy: new mongoose_1.Types.ObjectId()
    }
];
exports.default = exports.companyInfoSeedData;
