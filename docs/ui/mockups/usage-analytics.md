# Usage Analytics - ASCII Mockup

**Route:** `/dashboard/analytics`  
**Purpose:** Monitor usage and performance metrics

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 BotAI          Dashboard    Knowledge    Analytics    Settings          │
│                                                                    John ▼   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dashboard > Analytics                                                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            Usage Analytics                                  │
│                                                                             │
│                    Monitor your AI bot performance                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                          ── TIME PERIOD ──                                 │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Today     │ │  This Week  │ │ This Month  │ │ Custom Range          ▼ │ │
│  └─────────────┘ └─────────────┘ └──■──────────┘ └─────────────────────────┘ │
│                                                                             │
│                          December 2024 Overview                            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           ── KEY METRICS ──                                │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │  │                 │             │
│  │ 💬 Messages     │  │ 🔥 Tokens       │  │ ⚡ Avg Response │             │
│  │   Processed     │  │    Consumed     │  │     Time        │             │
│  │                 │  │                 │  │                 │             │
│  │     2,847       │  │    38,247       │  │      0.8s       │             │
│  │                 │  │                 │  │                 │             │
│  │ ↗ +12% vs Nov   │  │ ██████████░ 76%│  │ ↗ +0.1s vs Nov  │             │
│  │                 │  │ of 50K limit    │  │                 │             │
│  │                 │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │  │                 │             │
│  │ 🎯 Success Rate │  │ 👥 Unique Users │  │ 💰 Cost Savings │             │
│  │                 │  │                 │  │   (Estimated)   │             │
│  │                 │  │                 │  │                 │             │
│  │     94.2%       │  │      834        │  │    $2,340       │             │
│  │                 │  │                 │  │                 │             │
│  │ ↗ +0.3% vs Nov  │  │ ↗ +67 vs Nov    │  │ vs manual       │             │
│  │                 │  │                 │  │ support costs   │             │
│  │                 │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                        ── USAGE TRENDS ──                                  │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │                                     │  │                                 │ │
│  │        Daily Message Volume         │  │      Token Consumption         │ │
│  │                                     │  │                                 │ │
│  │  Messages                           │  │  Tokens (K)                     │ │
│  │    200┤                             │  │    4┤                           │ │
│  │       │        ╭─╮                  │  │     │       ╭─╮                 │ │
│  │    150┤       ╱   ╲      ╭─╮        │  │    3┤      ╱   ╲     ╭─╮       │ │
│  │       │      ╱     ╲    ╱   ╲       │  │     │     ╱     ╲   ╱   ╲      │ │
│  │    100┤     ╱       ╲  ╱     ╲      │  │    2┤    ╱       ╲ ╱     ╲     │ │
│  │       │    ╱         ╲╱       ╲     │  │     │   ╱         ╲╱       ╲    │ │
│  │     50┤   ╱                   ╲    │  │    1┤  ╱                   ╲   │ │
│  │       │  ╱                     ╲   │  │     │ ╱                     ╲  │ │
│  │      0└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─╲ │  │    0└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─╲│ │
│  │        1  3  5  7  9 11 13 15 17   │  │      1  3  5  7  9 11 13 15 17  │ │
│  │                                     │  │                                 │ │
│  │  Peak: Dec 15 (189 messages)       │  │  Peak: Dec 15 (3.8K tokens)    │ │
│  │  Avg: 92 messages/day               │  │  Avg: 1.2K tokens/day          │ │
│  │                                     │  │                                 │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                       ── PERFORMANCE ANALYSIS ──                           │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │                                     │  │                                 │ │
│  │       Response Time Distribution    │  │        Peak Hours Analysis     │ │
│  │                                     │  │                                 │ │
│  │  Count                              │  │  Messages/Hour                  │ │
│  │   800┤                              │  │    25┤                          │ │
│  │      │  ██                          │  │      │      ██                  │ │
│  │   600┤  ██                          │  │    20┤      ██                  │ │
│  │      │  ██  ██                      │  │      │      ██  ██              │ │
│  │   400┤  ██  ██  ██                  │  │    15┤      ██  ██              │ │
│  │      │  ██  ██  ██                  │  │      │  ██  ██  ██              │ │
│  │   200┤  ██  ██  ██  ██              │  │    10┤  ██  ██  ██  ██          │ │
│  │      │  ██  ██  ██  ██  ██          │  │      │  ██  ██  ██  ██  ██      │ │
│  │     0└─┴██┴─██┴─██┴─██┴─██┴─██┴─────┤ │  │     5└─██┴─██┴─██┴─██┴─██┴─██─┤ │
│  │        <1s 1-2s 2-3s 3-5s >5s       │  │       9  11  13  15  17  19 hr │ │
│  │                                     │  │                                 │ │
│  │  94% of responses < 2 seconds       │  │  Peak: 2-4 PM (avg 22/hr)      │ │
│  │  Avg: 0.8s  •  Median: 0.6s        │  │  Quiet: 11PM-7AM (avg 3/hr)    │ │
│  │                                     │  │                                 │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                       ── CONTENT PERFORMANCE ──                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                      📊 Knowledge Base Usage                           │ │
│  │                                                                         │ │
│  │  Most Referenced Content:               Response Accuracy by Category: │ │
│  │                                                                         │ │
│  │  1. Support Contact Info    (847 uses)  Product FAQ        ████████░ 96%│ │
│  │  2. Product FAQ            (623 uses)  Support Info       ████████░ 94%│ │
│  │  3. Return Policy          (445 uses)  Return Policy      ███████░░ 89%│ │
│  │  4. Shipping Info          (289 uses)  Shipping Info      ██████░░░ 82%│ │
│  │  5. Technical Docs         (156 uses)  Technical Docs     ████████░ 76%│ │
│  │                                                                         │ │
│  │  Content Gaps Identified:              Content Update Recommendations: │ │
│  │  • Billing questions (47 unanswered)   • Technical Docs (outdated)    │ │
│  │  • International shipping (23)         • Shipping Info (incomplete)    │ │
│  │  • API troubleshooting (18)            • Pricing Guide (missing)       │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      Update Knowledge Base                         │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                          ── USER INSIGHTS ──                               │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │                                     │  │                                 │ │
│  │        User Interaction Types       │  │      Geographic Distribution   │ │
│  │                                     │  │                                 │ │
│  │              ╭─╮                    │  │  🇺🇸 United States      67%    │ │
│  │             ╱   ╲                   │  │  🇨🇦 Canada             12%    │ │
│  │            ╱     ╲                  │  │  🇬🇧 United Kingdom      8%    │ │
│  │        ╭──╱       ╲──╮              │  │  🇩🇪 Germany             5%    │ │
│  │      ╱               ╲              │  │  🇦🇺 Australia           4%    │ │
│  │    ╱                   ╲            │  │  🌍 Other                4%    │ │
│  │                                     │  │                                 │ │
│  │  Questions      (67%)               │  │  User Activity Levels:         │ │
│  │  Complaints     (18%)               │  │  • High (>20 msgs): 89 users   │ │
│  │  Compliments    (8%)                │  │  • Medium (5-20): 234 users    │ │
│  │  Other          (7%)                │  │  • Low (<5): 511 users         │ │
│  │                                     │  │                                 │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ── EXPORT & ALERTS ──                              │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │  │                 │             │
│  │ 📊 Export Data  │  │ ⚠️ Set Alerts   │  │ 📧 Schedule     │             │
│  │                 │  │                 │  │   Reports       │             │
│  │ Download CSV,   │  │ Get notified    │  │ Auto-email      │             │
│  │ PDF, or Excel   │  │ at 75%, 90%,    │  │ weekly/monthly  │             │
│  │ reports         │  │ 95% usage       │  │ analytics       │             │
│  │                 │  │                 │  │                 │             │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │             │
│  │ │   Export    │ │  │ │Setup Alerts│ │  │ │  Schedule   │ │             │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                          ── RECOMMENDATIONS ──                             │
│                                                                             │
│  🎯 Based on your usage patterns, here are our recommendations:            │
│                                                                             │
│  💡 Performance Optimization:                                              │
│     • Consider upgrading to Enterprise plan for better response times      │
│     • Update Technical Documentation to improve accuracy                   │
│                                                                             │
│  📚 Content Improvements:                                                  │
│     • Add billing FAQ to address common unanswered queries                 │
│     • Create international shipping guide                                  │
│                                                                             │
│  ⚡ Usage Optimization:                                                    │
│     • You're using 76% of your token limit - consider upgrading           │
│     • Peak hours: 2-4 PM - ensure adequate capacity                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         Apply Recommendations                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Components:

### Time Period Selection
- **Quick filters**: Today, This Week, This Month
- **Custom range** picker for detailed analysis
- **Period comparison** with previous timeframes

### Key Metrics Cards
- **Messages Processed**: Total with growth comparison
- **Token Consumption**: Usage with progress bar to limit
- **Average Response Time**: Performance metric with trend
- **Success Rate**: Accuracy percentage with improvement indicator
- **Unique Users**: User engagement metrics
- **Cost Savings**: Business impact estimation

### Usage Trends Charts
- **Daily Message Volume**: Line chart showing activity patterns
- **Token Consumption**: Resource usage over time
- **Interactive charts** with hover details and peak identification

### Performance Analysis
- **Response Time Distribution**: Histogram of response speeds
- **Peak Hours Analysis**: Activity patterns by time of day
- **Performance benchmarks** and comparative metrics

### Content Performance
- **Most Referenced Content**: Usage rankings by content piece
- **Response Accuracy**: Success rates by content category
- **Content Gaps**: Identified areas needing improvement
- **Update Recommendations**: Actionable content suggestions

### User Insights
- **Interaction Types**: Classification of user queries
- **Geographic Distribution**: User location analytics
- **Activity Levels**: User engagement segmentation
- **Behavioral patterns** analysis

### Export & Alerts
- **Data Export**: Multiple format options (CSV, PDF, Excel)
- **Alert Configuration**: Usage threshold notifications
- **Scheduled Reports**: Automated analytics delivery
- **Customizable reporting** options

### AI Recommendations
- **Performance optimization** suggestions
- **Content improvement** recommendations
- **Usage optimization** insights
- **Actionable next steps** with implementation links

## Interactive Features:
- **Drill-down charts** for detailed analysis
- **Filter combinations** for specific insights
- **Real-time data** updates
- **Comparative analysis** tools

## Export Options:
- **CSV format** for data analysis
- **PDF reports** for presentations
- **Excel files** for further processing
- **API endpoints** for integration

## Alert System:
- **Usage thresholds** (75%, 90%, 95%)
- **Performance degradation** warnings
- **Content gap** notifications
- **Custom alert** configurations

## Responsive Design:
- Mobile: Single column, stacked charts
- Tablet: Two-column layout with condensed metrics
- Desktop: Full dashboard layout as shown