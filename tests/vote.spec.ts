import { test, expect, Page } from '@playwright/test';

async function snap(page: Page, label: string) {
  await test.info().attach(label, { body: await page.screenshot(), contentType: 'image/png' });
}

test('tc_2000 | 투표 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await snap(page, '투표 탭 진입 화면');
  await expect(page.getByText('우리 집 투표')).toBeVisible();
});

test('tc_2001 | 투표 생성', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await snap(page, '투표 생성 모달 - 초기 화면');
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
  await snap(page, '질문 입력 후 값 반영 확인');
  await expect(page.getByPlaceholder('질문을 입력해주세요')).toHaveValue('테스트 질문');
});

test('tc_2003 | 투표 생성 - 질문 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill(' ');
  await snap(page, '질문 공백 입력 - 만들기 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2016 | 투표 생성 - 질문 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('!@#$%');
  await snap(page, '질문 특수문자 입력 - 만들기 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2004 | 투표 생성 - 질문 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('가'.repeat(201));
  await snap(page, '질문 200자 초과 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('200자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2005 | 투표 생성 - 선택지 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill(' ');
  await snap(page, '선택지 공백 입력 - 만들기 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2017 | 투표 생성 - 선택지 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('테스트 질문');
  await page.getByPlaceholder('선택지 1').fill('!@#$%');
  await snap(page, '선택지 특수문자 입력 - 만들기 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '만들기' })).toBeDisabled();
});

test('tc_2006 | 투표 생성 - 선택지 : 200자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('선택지 1').fill('가'.repeat(201));
  await snap(page, '선택지 200자 초과 - 에러 메시지 및 버튼 상태 확인');
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
  await snap(page, '선택지 1개만 입력 후 만들기 클릭 - 에러 메시지 확인');
  await expect(page.getByText('선택지를 2개 이상 입력해줘!')).toBeVisible();
});

test('tc_2008 | 투표 생성 - 선택지 추가 : 추가 가능 갯수 초과', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  for (let i = 0; i < 10; i++) {
    const addBtn = page.getByText('+ 선택지 추가');
    if (await addBtn.isVisible()) {
      await addBtn.click();
    } else {
      break;
    }
  }
  await snap(page, '선택지 5개(최대) 도달 - 추가 버튼 숨김 확인');
  await expect(page.getByText('+ 선택지 추가')).not.toBeVisible();
});

test('tc_2010 | 투표 생성 - 취소', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '투표' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('질문을 입력해주세요').fill('취소 테스트');
  await page.getByRole('button', { name: '취소' }).click();
  await snap(page, '취소 클릭 후 모달 닫힘 확인');
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
  await snap(page, '투표 생성 완료 - 목록에 반영 확인');
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
  await snap(page, '삭제 전 - 투표 카드 존재 확인');
  await page.getByText('삭제할 투표').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 투표 카드 제거 확인');
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
  await snap(page, 'A 선택 후 B로 재선택 - 최종 선택 상태 확인');
  await expect(page.getByText('선택지 B')).toHaveClass(/selected|active/);
});

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
  await snap(page, '중복 문구 선택지 2개 생성 직후');
  await expect(chickenBtns).toHaveCount(2);

  await chickenBtns.nth(1).click();

  await snap(page, '두 번째 치킨만 클릭한 후 선택 상태');
  await expect(chickenBtns.nth(1)).toHaveClass(/selected|active/);
  await expect(chickenBtns.nth(0)).not.toHaveClass(/selected|active/);
});