import { test, expect } from '@playwright/test';

//투표


test('tc_2000 | 투표 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await expect(page.getByText('우리 집 투표')).toBeVisible();
});

test('tc_2001 | 투표 생성', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByText('새 투표 만들기')).toBeVisible();
  await expect(page.getByPlaceholder('질문을 입력해주세요')).toBeVisible();
  await expect(page.getByPlaceholder('선택지 1')).toBeVisible();
  await expect(page.getByPlaceholder('선택지 2')).toBeVisible();
  await expect(page.getByText('+ 선택지 추가')).toBeVisible();
  await expect(page.getByRole('button', { name: '취소' })).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeVisible();
});

test('tc_2002 | 투표 생성 - 질문', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await expect(page.getByPlaceholder('질문을 입력해주세요')).toHaveValue('테스트 질문');
});

test('tc_2003 | 투표 생성 - 질문 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill(' ');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2016 | 투표 생성 - 질문 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('!@#$%');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2004 | 투표 생성 - 질문 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('가'.repeat(201));
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2005 | 투표 생성 - 선택지 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill(' ');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2017 | 투표 생성 - 선택지 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill('!@#$%');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2006 | 투표 생성 - 선택지 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('선택지 1').fill('가'.repeat(201));
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2018 | 투표 생성 - 선택지 - 1개만 입력 후 생성', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill('선택지 하나');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByText('선택지를 2개 이상 입력해줘!')).toBeVisible();
});

test('tc_2008 | 투표 생성 - 선택지 추가 : 추가 가능 갯수 초과', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  // 최대 갯수까지 선택지 추가
  for (let i = 0; i < 10; i++) {
    const addBtn = page.getByText('+ 선택지 추가');
    if (await addBtn.isVisible()) {
      await addBtn.click();
    } else {
      break;
    }
  }
  await expect(page.getByText('+ 선택지 추가')).not.toBeVisible();
});

test('tc_2010 | 투표 생성 - 취소', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('취소 테스트');
  await page.getByRole('button', { name: '취소' }).click();
  await expect(page.getByText('새 투표 만들기')).not.toBeVisible();
  await expect(page.getByText('취소 테스트')).not.toBeVisible();
});

test('tc_2011 | 투표 생성 - 만들기', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('만들기 테스트');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await expect(page.getByText('새 투표 만들기')).not.toBeVisible();
  await expect(page.getByText('만들기 테스트')).toBeVisible();
});

test('tc_2012 | 투표 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('삭제할 투표');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await page.getByText('삭제할 투표').locator('..').getByRole('button').click();
  await expect(page.getByText('삭제할 투표')).not.toBeVisible();
});

test('tc_2015 | 투표 중복 참여', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('중복 참여 테스트');
  await page.getByPlaceholder('선택지 1').fill('선택지 A');
  await page.getByPlaceholder('선택지 2').fill('선택지 B');
  await page.getByRole('button', { name: '만들기' }).click();
  await page.getByText('선택지 A').click();
  await page.getByText('선택지 B').click();
  await expect(page.getByText('선택지 B')).toHaveClass(/selected|active/);
});

// ────────────────────────────────────────────────────────────
// 실사용 중 발견한 엣지케이스
// 투표 선택지에 같은 문구를 두 번 입력하면
// (예: "치킨" / "치킨") 어느 쪽을 눌러도 같은 선택지로 처리되는 것처럼
// ────────────────────────────────────────────────────────────

test('tc_2019 | 투표 생성 - 선택지 텍스트 중복 시 득표가 선택지별로 분리된다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('오늘 저녁 뭐 먹지');
  await page.getByPlaceholder('선택지 1').fill('치킨');
  await page.getByPlaceholder('선택지 2').fill('치킨');
  await page.getByRole('button', { name: '만들기' }).click();

  const card = page.locator('.vote-card', { hasText: '오늘 저녁 뭐 먹지' });
  const chickenBtns = card.getByRole('button', { name: '치킨' });
  await expect(chickenBtns).toHaveCount(2);

  // 두 번째 "치킨"만 클릭
  await chickenBtns.nth(1).click();

  // 두 번째 선택지만 내 선택으로 표시되고, 첫 번째는 영향받지 않아야 한다
  await expect(chickenBtns.nth(1)).toHaveClass(/selected|active/);
  await expect(chickenBtns.nth(0)).not.toHaveClass(/selected|active/);
});